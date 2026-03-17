/* global importScripts */

importScripts("v1298-system-data.js");

var G_AU3_SOLAR_DAY2 = 0.00029591220828559104;
var KICK_FACTOR = 0.12;
var system = self.V1298TauSystem;
var state = null;
var timerId = null;

function normalizeAngle(angle) {
    var tau = Math.PI * 2;
    var wrapped = angle % tau;
    return wrapped < 0 ? wrapped + tau : wrapped;
}

function meanAnomalyFromTic(periodDays, eccentricity, omegaRad, ticBkJD, epochBkJD) {
    var trueAnomalyAtTransit = (Math.PI / 2) - omegaRad;
    var sinHalf = Math.sin(trueAnomalyAtTransit / 2);
    var cosHalf = Math.cos(trueAnomalyAtTransit / 2);
    var eccentricAnomalyAtTransit = 2 * Math.atan2(
        Math.sqrt(1 - eccentricity) * sinHalf,
        Math.sqrt(1 + eccentricity) * cosHalf
    );
    var meanAnomalyAtTransit = eccentricAnomalyAtTransit - (eccentricity * Math.sin(eccentricAnomalyAtTransit));
    var meanMotion = (Math.PI * 2) / periodDays;
    return normalizeAngle(meanAnomalyAtTransit - (meanMotion * (ticBkJD - epochBkJD)));
}

function solveKepler(meanAnomaly, eccentricity) {
    var eccentricAnomaly = eccentricity < 0.8 ? meanAnomaly : Math.PI;
    for (var iteration = 0; iteration < 10; iteration += 1) {
        var f = eccentricAnomaly - (eccentricity * Math.sin(eccentricAnomaly)) - meanAnomaly;
        var fp = 1 - (eccentricity * Math.cos(eccentricAnomaly));
        eccentricAnomaly -= f / fp;
    }
    return eccentricAnomaly;
}

function semimajorAxisFromPeriod(periodDays, totalMassSolar) {
    var meanMotion = (Math.PI * 2) / periodDays;
    return Math.cbrt((G_AU3_SOLAR_DAY2 * totalMassSolar) / (meanMotion * meanMotion));
}

function orbitalStateFromElements(periodDays, eccentricity, omegaRad, meanAnomaly, totalMassSolar) {
    var semimajorAxis = semimajorAxisFromPeriod(periodDays, totalMassSolar);
    var eccentricAnomaly = solveKepler(meanAnomaly, eccentricity);
    var cosE = Math.cos(eccentricAnomaly);
    var sinE = Math.sin(eccentricAnomaly);
    var radiusFactor = 1 - (eccentricity * cosE);
    var meanMotion = (Math.PI * 2) / periodDays;
    var root = Math.sqrt(1 - (eccentricity * eccentricity));

    var xOrbital = semimajorAxis * (cosE - eccentricity);
    var yOrbital = semimajorAxis * root * sinE;
    var vxOrbital = -semimajorAxis * meanMotion * sinE / radiusFactor;
    var vyOrbital = semimajorAxis * meanMotion * root * cosE / radiusFactor;

    var cosOmega = Math.cos(omegaRad);
    var sinOmega = Math.sin(omegaRad);

    return {
        x: (xOrbital * cosOmega) - (yOrbital * sinOmega),
        y: (xOrbital * sinOmega) + (yOrbital * cosOmega),
        vx: (vxOrbital * cosOmega) - (vyOrbital * sinOmega),
        vy: (vxOrbital * sinOmega) + (vyOrbital * cosOmega)
    };
}

function buildInitialState() {
    var bodies = [
        {
            id: "star",
            mass: system.starMassSolar,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0
        }
    ];

    system.planets.forEach(function(planet) {
        var meanAnomaly = meanAnomalyFromTic(
            planet.periodDays,
            planet.eccentricity,
            planet.omegaRad,
            planet.ticBkJD,
            system.epochBkJD
        );
        var orbitState = orbitalStateFromElements(
            planet.periodDays,
            planet.eccentricity,
            planet.omegaRad,
            meanAnomaly,
            system.starMassSolar + planet.massSolar
        );

        bodies.push({
            id: planet.id,
            mass: planet.massSolar,
            glyph: planet.glyph,
            x: orbitState.x,
            y: orbitState.y,
            vx: orbitState.vx,
            vy: orbitState.vy
        });
    });

    var totalMass = 0;
    var barycenterX = 0;
    var barycenterY = 0;
    var barycenterVx = 0;
    var barycenterVy = 0;

    bodies.forEach(function(body) {
        totalMass += body.mass;
        barycenterX += body.mass * body.x;
        barycenterY += body.mass * body.y;
        barycenterVx += body.mass * body.vx;
        barycenterVy += body.mass * body.vy;
    });

    barycenterX /= totalMass;
    barycenterY /= totalMass;
    barycenterVx /= totalMass;
    barycenterVy /= totalMass;

    bodies.forEach(function(body) {
        body.x -= barycenterX;
        body.y -= barycenterY;
        body.vx -= barycenterVx;
        body.vy -= barycenterVy;
    });

    return {
        timeBkJD: system.epochBkJD,
        bodies: bodies
    };
}

function computeAccelerations(bodies) {
    var accelerations = bodies.map(function() {
        return { ax: 0, ay: 0 };
    });

    for (var first = 0; first < bodies.length; first += 1) {
        for (var second = first + 1; second < bodies.length; second += 1) {
            var dx = bodies[second].x - bodies[first].x;
            var dy = bodies[second].y - bodies[first].y;
            var distanceSquared = (dx * dx) + (dy * dy);
            var distance = Math.sqrt(distanceSquared);
            var distanceCubed = distanceSquared * distance;
            var factor = G_AU3_SOLAR_DAY2 / distanceCubed;

            accelerations[first].ax += factor * bodies[second].mass * dx;
            accelerations[first].ay += factor * bodies[second].mass * dy;
            accelerations[second].ax -= factor * bodies[first].mass * dx;
            accelerations[second].ay -= factor * bodies[first].mass * dy;
        }
    }

    return accelerations;
}

function stepSimulation(stepDays) {
    var bodies = state.bodies;
    var accelerations = computeAccelerations(bodies);

    for (var index = 0; index < bodies.length; index += 1) {
        bodies[index].vx += accelerations[index].ax * stepDays * 0.5;
        bodies[index].vy += accelerations[index].ay * stepDays * 0.5;
        bodies[index].x += bodies[index].vx * stepDays;
        bodies[index].y += bodies[index].vy * stepDays;
    }

    accelerations = computeAccelerations(bodies);

    for (index = 0; index < bodies.length; index += 1) {
        bodies[index].vx += accelerations[index].ax * stepDays * 0.5;
        bodies[index].vy += accelerations[index].ay * stepDays * 0.5;
    }

    state.timeBkJD += stepDays;
}

function currentPlanetFrame() {
    var star = state.bodies[0];

    return state.bodies.slice(1).map(function(body) {
        return {
            id: body.id,
            glyph: body.glyph,
            x: body.x - star.x,
            y: body.y - star.y
        };
    });
}

function emitFrame() {
    self.postMessage({
        type: "frame",
        timeBkJD: state.timeBkJD,
        planets: currentPlanetFrame()
    });
}

function tick() {
    var stepDays = system.render.stepDays;
    for (var step = 0; step < system.render.stepsPerFrame; step += 1) {
        stepSimulation(stepDays);
    }
    emitFrame();
}

function start() {
    if (!state) {
        state = buildInitialState();
    }

    if (timerId !== null) {
        return;
    }

    emitFrame();
    timerId = setInterval(tick, Math.round(1000 / system.render.frameRate));
}

function stop() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function resume() {
    if (!state) {
        state = buildInitialState();
    }

    if (timerId !== null) {
        return;
    }

    timerId = setInterval(tick, Math.round(1000 / system.render.frameRate));
}

function applyKick(planetId) {
    var star = state.bodies[0];
    var target = state.bodies.find(function(body) {
        return body.id === planetId;
    });

    if (!target) {
        return;
    }

    var relativeVelocityX = target.vx - star.vx;
    var relativeVelocityY = target.vy - star.vy;

    target.vx += relativeVelocityX * KICK_FACTOR;
    target.vy += relativeVelocityY * KICK_FACTOR;
    emitFrame();
}

self.onmessage = function(event) {
    var data = event.data || {};

    if (data.type === "start") {
        start();
        return;
    }

    if (data.type === "stop") {
        stop();
        return;
    }

    if (data.type === "reset") {
        stop();
        state = buildInitialState();
        emitFrame();
        return;
    }

    if (data.type === "pause") {
        stop();
        return;
    }

    if (data.type === "resume") {
        resume();
        return;
    }

    if (data.type === "kick") {
        if (!state) {
            state = buildInitialState();
        }

        applyKick(data.planetId);
    }
};

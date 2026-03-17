document.addEventListener("DOMContentLoaded", function() {
    var system = window.V1298TauSystem;
    var asciiContainer = document.getElementById("ascii");
    var asciiHint = document.getElementById("ascii-hint");
    var asciiPre = asciiContainer ? asciiContainer.querySelector("pre") : null;

    if (!system || !asciiContainer || !asciiPre || !window.Worker) {
        return;
    }

    var G_AU3_SOLAR_DAY2 = 0.00029591220828559104;
    var desktopQuery = window.matchMedia("(min-width: 769px)");
    var hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var worker = null;
    var histories = {};
    var latestPlanets = [];
    var latestPlanetCells = {};
    var hoveredPlanetId = null;
    var isUnlocked = false;
    var showOrbitGuides = true;
    var isInteractionPaused = false;
    var hoverPauseEnabled = true;
    var kickResumeTimerId = null;
    var orbitGuides = buildOrbitGuides(system);
    var maxProjectedRadius = computeProjectedRadius(orbitGuides);
    var hitRadiusSquared = 9;

    if (asciiHint) {
        asciiHint.hidden = true;
        asciiHint.textContent = "";
    }

    function subscribe(query, listener) {
        if (query.addEventListener) {
            query.addEventListener("change", listener);
            return;
        }
        query.addListener(listener);
    }

    function shouldAnimate() {
        return isUnlocked && desktopQuery.matches && hoverQuery.matches && !motionQuery.matches;
    }

    function syncCursor() {
        asciiContainer.style.cursor = hoveredPlanetId ? "pointer" : "default";
    }

    function clearHistories() {
        Object.keys(histories).forEach(function(id) {
            histories[id] = [];
        });
    }

    function clearKickResumeTimer() {
        if (kickResumeTimerId !== null) {
            window.clearTimeout(kickResumeTimerId);
            kickResumeTimerId = null;
        }
    }

    function pauseForInteraction() {
        if (!worker || isInteractionPaused) {
            return;
        }

        worker.postMessage({ type: "pause" });
        isInteractionPaused = true;
    }

    function resumeFromInteraction() {
        if (!worker || !isInteractionPaused) {
            return;
        }

        worker.postMessage({ type: "resume" });
        isInteractionPaused = false;
    }

    function setHoveredPlanetId(nextPlanetId) {
        if (hoveredPlanetId === nextPlanetId) {
            return;
        }

        hoveredPlanetId = nextPlanetId;
        syncCursor();

        if (latestPlanets.length) {
            render(latestPlanets);
        }
    }

    function semimajorAxisFromPeriod(periodDays, totalMassSolar) {
        var meanMotion = (Math.PI * 2) / periodDays;
        return Math.cbrt((G_AU3_SOLAR_DAY2 * totalMassSolar) / (meanMotion * meanMotion));
    }

    function orbitalPoint(planet, trueAnomaly) {
        var semimajorAxis = semimajorAxisFromPeriod(planet.periodDays, system.starMassSolar + planet.massSolar);
        var radius = (semimajorAxis * (1 - (planet.eccentricity * planet.eccentricity))) / (1 + (planet.eccentricity * Math.cos(trueAnomaly)));
        var theta = trueAnomaly + planet.omegaRad;

        return {
            x: radius * Math.cos(theta),
            y: radius * Math.sin(theta)
        };
    }

    function buildOrbitGuides(activeSystem) {
        var guides = {};

        activeSystem.planets.forEach(function(planet) {
            var points = [];

            for (var index = 0; index < activeSystem.render.orbitSamples; index += 1) {
                var trueAnomaly = (Math.PI * 2 * index) / activeSystem.render.orbitSamples;
                points.push(orbitalPoint(planet, trueAnomaly));
            }

            guides[planet.id] = points;
            histories[planet.id] = [];
        });

        return guides;
    }

    function projectPoint(point) {
        var azimuth = system.render.azimuthRad;
        var tilt = system.render.tiltRad;
        var rotatedX = (point.x * Math.cos(azimuth)) - (point.y * Math.sin(azimuth));
        var rotatedY = (point.x * Math.sin(azimuth)) + (point.y * Math.cos(azimuth));

        return {
            x: rotatedX,
            y: rotatedY * Math.sin(tilt)
        };
    }

    function computeProjectedRadius(guides) {
        var radius = 0;

        Object.keys(guides).forEach(function(id) {
            guides[id].forEach(function(point) {
                var projected = projectPoint(point);
                radius = Math.max(radius, Math.abs(projected.x), Math.abs(projected.y));
            });
        });

        return radius * 1.12;
    }

    function createGrid() {
        var rows = [];
        for (var row = 0; row < system.render.rows; row += 1) {
            rows.push(new Array(system.render.columns).fill(" "));
        }
        return rows;
    }

    function toGrid(point) {
        var projected = projectPoint(point);
        var column = Math.round((((projected.x / maxProjectedRadius) + 1) * 0.5) * (system.render.columns - 1));
        var row = Math.round((0.5 - ((projected.y / maxProjectedRadius) * 0.5)) * (system.render.rows - 1));

        return {
            column: column,
            row: row
        };
    }

    function plot(grid, point, glyph) {
        var cell = toGrid(point);
        if (cell.row < 0 || cell.row >= grid.length || cell.column < 0 || cell.column >= grid[0].length) {
            return null;
        }
        grid[cell.row][cell.column] = glyph;
        return cell;
    }

    function drawOrbitGuides(grid) {
        if (!showOrbitGuides) {
            return;
        }

        Object.keys(orbitGuides).forEach(function(id) {
            orbitGuides[id].forEach(function(point, index) {
                if (index % 2 === 0) {
                    plot(grid, point, ".");
                }
            });
        });
    }

    function drawTrails(grid) {
        Object.keys(histories).forEach(function(id) {
            var trail = histories[id];
            trail.forEach(function(point, index) {
                var ageRatio = (index + 1) / trail.length;
                plot(grid, point, ageRatio > 0.7 ? ":" : ".");
            });
        });
    }

    function drawBodies(grid, planets) {
        var center = {
            x: 0,
            y: 0
        };

        latestPlanetCells = {};
        plot(grid, center, "*");

        planets.forEach(function(planet) {
            var glyph = planet.id === hoveredPlanetId ? planet.id.toUpperCase() : planet.glyph;
            var cell = plot(grid, planet, glyph);
            if (cell) {
                latestPlanetCells[planet.id] = cell;
            }
        });
    }

    function render(planets) {
        var grid = createGrid();

        drawOrbitGuides(grid);
        drawTrails(grid);
        drawBodies(grid, planets);

        asciiPre.textContent = grid.map(function(row) {
            return row.join("");
        }).join("\n");
    }

    function handleFrame(data) {
        latestPlanets = data.planets;
        data.planets.forEach(function(planet) {
            var trail = histories[planet.id];
            trail.push({ x: planet.x, y: planet.y });
            if (trail.length > system.render.trailLength) {
                trail.shift();
            }
        });

        render(data.planets);
    }

    function startWorker() {
        if (worker || !shouldAnimate()) {
            return;
        }

        worker = new Worker("js/v1298-animation-worker.js");
        worker.onmessage = function(event) {
            if (event.data && event.data.type === "frame") {
                handleFrame(event.data);
            }
        };
        worker.onerror = function() {
            stopWorker();
        };

        document.body.classList.add("has-ascii-animation");
        asciiContainer.setAttribute("aria-hidden", "false");
        showOrbitGuides = true;
        isInteractionPaused = false;
        hoverPauseEnabled = true;
        syncCursor();
        worker.postMessage({ type: "start" });
    }

    function stopWorker() {
        if (worker) {
            worker.postMessage({ type: "stop" });
            worker.terminate();
            worker = null;
        }

        clearKickResumeTimer();
        clearHistories();
        latestPlanets = [];
        latestPlanetCells = {};
        hoveredPlanetId = null;
        showOrbitGuides = true;
        isInteractionPaused = false;
        hoverPauseEnabled = true;
        asciiPre.textContent = "";
        asciiContainer.setAttribute("aria-hidden", "true");
        syncCursor();
        document.body.classList.remove("has-ascii-animation");
    }

    function getPointerCoordinates(event) {
        var rect = asciiPre.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return null;
        }

        var column = ((event.clientX - rect.left) / rect.width) * (system.render.columns - 1);
        var row = ((event.clientY - rect.top) / rect.height) * (system.render.rows - 1);

        return {
            column: column,
            row: row
        };
    }

    function getHoveredPlanetFromEvent(event) {
        var pointer = getPointerCoordinates(event);
        var nearestPlanetId = null;
        var nearestDistanceSquared = Infinity;

        if (!pointer) {
            return null;
        }

        Object.keys(latestPlanetCells).forEach(function(planetId) {
            var cell = latestPlanetCells[planetId];
            var deltaColumn = pointer.column - cell.column;
            var deltaRow = pointer.row - cell.row;
            var distanceSquared = (deltaColumn * deltaColumn) + (deltaRow * deltaRow);

            if (distanceSquared <= hitRadiusSquared && distanceSquared < nearestDistanceSquared) {
                nearestDistanceSquared = distanceSquared;
                nearestPlanetId = planetId;
            }
        });

        return nearestPlanetId;
    }

    asciiContainer.addEventListener("mousemove", function(event) {
        if (!worker || !latestPlanets.length) {
            return;
        }

        if (hoverPauseEnabled) {
            pauseForInteraction();
        }
        setHoveredPlanetId(getHoveredPlanetFromEvent(event));
    });

    asciiContainer.addEventListener("mouseleave", function() {
        clearKickResumeTimer();
        hoverPauseEnabled = true;
        setHoveredPlanetId(null);
        resumeFromInteraction();
    });

    asciiContainer.addEventListener("click", function() {
        if (!worker || !hoveredPlanetId) {
            return;
        }

        clearKickResumeTimer();
        clearHistories();
        showOrbitGuides = false;
        render(latestPlanets);
        worker.postMessage({
            type: "kick",
            planetId: hoveredPlanetId
        });

        hoverPauseEnabled = false;
        resumeFromInteraction();
        kickResumeTimerId = window.setTimeout(function() {
            hoverPauseEnabled = true;
            kickResumeTimerId = null;
        }, 900);
    });

    function syncAnimationState() {
        if (document.hidden || !shouldAnimate()) {
            stopWorker();
            return;
        }

        startWorker();
    }

    function unlockAnimation() {
        if (isUnlocked) {
            return;
        }

        isUnlocked = true;
        syncAnimationState();
    }

    subscribe(desktopQuery, syncAnimationState);
    subscribe(hoverQuery, syncAnimationState);
    subscribe(motionQuery, syncAnimationState);
    document.addEventListener("visibilitychange", syncAnimationState);
    document.addEventListener("theme-toggle-activated", unlockAnimation);

    syncAnimationState();
});

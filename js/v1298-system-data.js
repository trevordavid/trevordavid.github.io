(function(global) {
    var V1298TauSystem = {
        source: "Median posterior parameters extracted from jnkepler examples/v1298tau_samples.npz for Livingston et al. (2026).",
        epochBkJD: 2230,
        starMassSolar: 1.10,
        render: {
            columns: 68,
            rows: 24,
            frameRate: 15,
            stepsPerFrame: 4,
            stepDays: 0.09,
            trailLength: 96,
            orbitSamples: 120,
            azimuthRad: 0.58,
            tiltRad: 0.96
        },
        planets: [
            {
                id: "b",
                massSolar: 1.3102943445562389e-05,
                periodDays: 8.249890391532375,
                eccentricity: 0.005035487420782749,
                omegaRad: 1.3630094748346464,
                ticBkJD: 2231.2835017233615,
                glyph: "@"
            },
            {
                id: "c",
                massSolar: 1.6726681697703588e-05,
                periodDays: 12.40090751384333,
                eccentricity: 0.005613625306077081,
                omegaRad: -2.2103403418474556,
                ticBkJD: 2239.391600508615,
                glyph: "o"
            },
            {
                id: "d",
                massSolar: 3.563512998136159e-05,
                periodDays: 24.13932568162854,
                eccentricity: 0.006979738880063498,
                omegaRad: 0.7239221214505928,
                ticBkJD: 2234.0506810317793,
                glyph: "O"
            },
            {
                id: "e",
                massSolar: 4.29292067416904e-05,
                periodDays: 48.680289168335754,
                eccentricity: 0.004288751419739374,
                omegaRad: -2.352296793058297,
                ticBkJD: 2263.6239141791893,
                glyph: "0"
            }
        ]
    };

    global.V1298TauSystem = V1298TauSystem;
})(typeof self !== "undefined" ? self : this);

/**
 * Press items data file
 * 
 * Add, remove, or edit items in this array to manage press links
 * Each item should have:
 * - title: The publication name displayed on the website
 * - articleTitle: The title of the linked press article
 * - url: The link to the article
 * - date: (Optional) Publication date in YYYY-MM-DD format
 * - description: (Optional) Legacy short description
 */

const pressItems = [
    {
        title: "PHYSICS",
        url: "https://physics.aps.org/articles/v19/27",
        articleTitle: "Exoplanet Observations Sharpen Picture of Planetary Formation",
        date: "2026-02-24",
        description: "Exoplanet Observations Sharpen Picture of Planetary Formation"
    },
    {
        title: "NATURE NEWS & VIEWS",
        url: "assets/nature_20260108.pdf",
        articleTitle: "Ultra-low-density planets seen around a young star",
        date: "2026-01-08",
        description: "Ultra-low-density planets seen around a young star"
    },
    {
        title: "NEW SCIENTIST",
        url: "https://www.newscientist.com/article/2510539-super-low-density-worlds-reveal-how-common-planetary-systems-form/",
        articleTitle: "Super-low-density worlds reveal how common planetary systems form",
        date: "2026-01-07",
        description: "Super-low-density worlds reveal how common planetary systems form"
    },
    {
        title: "UCLA NEWSROOM",
        url: "https://newsroom.ucla.edu/releases/we-finally-know-how-the-most-common-types-of-planets-are-created",
        articleTitle: "We finally know how the most common types of planets are created",
        date: "2026-01-07",
        description: "We finally know how the most common types of planets are created"
    },
    {
        title: "NEW YORK TIMES",
        url: "https://www.nytimes.com/2024/01/12/science/wasp-69b-tail-planet.html",
        articleTitle: "This Distant Planet Has a 350,000-Mile-Long Comet-Like Tail",
        date: "2024-01-12",
        description: "This Distant Planet Has a 350,000-Mile-Long Comet-Like Tail"
    },
    {
        title: "SIMONS FOUNDATION",
        url: "https://www.simonsfoundation.org/2021/05/14/shrinking-planets-could-explain-mystery-of-universes-missing-worlds/",
        articleTitle: "Shrinking Planets Could Explain Mystery of Universe's Missing Worlds",
        date: "2021-05-14",
        description: "Shrinking Planets Could Explain Mystery of Universe's Missing Worlds"
    },
    {
        title: "NATURE ASTRONOMY RESEARCH HIGHLIGHTS",
        url: "assets/david19_nature-research-highlights.pdf",
        articleTitle: "A Kepler multiplanet system precursor",
        date: "2019-11-27",
        description: "A Kepler multiplanet system precursor"
    },
    {
        title: "LOS ANGELES TIMES",
        url: "https://www.latimes.com/science/sciencenow/la-sci-sn-young-exoplanet-20160620-snap-story.html",
        articleTitle: "Newly discovered 'baby' planets could unlock mysteries of planetary evolution",
        date: "2016-06-20",
        description: "Newly discovered 'baby' planets could unlock mysteries of planetary evolution"
    },
    {
        title: "THE GUARDIAN",
        url: "https://www.theguardian.com/science/2016/jun/20/baby-planets-givel-first-insights-into-planet-and-solar-system-formation-k233b",
        articleTitle: "Discovery of 'baby' planets sheds light on planet and solar system formation",
        date: "2016-06-20",
        description: "Discovery of 'baby' planets sheds light on planet and solar system formation"
    },    
    {
        title: "CALTECH",
        url: "https://www.caltech.edu/about/news/newborn-exoplanet-discovered-around-young-star-51017",
        articleTitle: "Newborn Exoplanet Discovered Around Young Star",
        date: "2016-06-20",
        description: "Newborn Exoplanet Discovered Around Young Star"
    },
    {
        title: "NASA",
        url: "https://www.jpl.nasa.gov/news/nasas-k2-finds-newborn-exoplanet-around-young-star/",
        articleTitle: "NASA's K2 Finds Newborn Exoplanet Around Young Star",
        date: "2016-06-20",
        description: "NASA's K2 Finds Newborn Exoplanet Around Young Star"
    }
];

// Make pressItems globally accessible for main.js
window.pressItems = pressItems;

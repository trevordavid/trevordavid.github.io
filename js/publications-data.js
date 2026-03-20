/**
 * Publications items data file
 *
 * Each item should have:
 * - title: The label shown in the UI
 * - articleTitle: (Optional) Full title shown on hover
 * - url: (Optional) Link for a direct publication item
 * - items: (Optional) Nested items for expandable sections
 * - summary: (Optional) Plain-text hover summary for a nested item
 * - summaryHtml: (Optional) Markup-enabled hover summary for a nested item
 */

const publicationItems = [
    {
        title: "GOOGLE SCHOLAR",
        url: "https://scholar.google.com/citations?user=t12ArKcAAAAJ&hl=en"
    },
    {
        title: "RESEARCH HIGHLIGHTS",
        items: [
            {
                title: "LIVINGSTON, PETIGURA, DAVID ET AL. 2026, NATURE",
                articleTitle: "A young progenitor for the most common planetary systems in the Galaxy",
                url: "https://www.nature.com/articles/s41586-025-09840-z",
                summary: ""
            },
            {
                title: "DAVID ET AL. 2022, THE ASTROPHYSICAL JOURNAL",
                articleTitle: "Further Evidence of Modified Spin-down in Sun-like Stars: Pileups in the Temperature-Period Distribution",
                url: "https://iopscience.iop.org/article/10.3847/1538-4357/ac6dd3",
                summary: ""
            },
            {
                title: "DAVID ET AL. 2021, THE ASTRONOMICAL JOURNAL",
                articleTitle: "Evolution of the Exoplanet Size Distribution: Forming Large Super-Earths Over Billions of Years",
                url: "https://iopscience.iop.org/article/10.3847/1538-3881/abf439",
                summary: ""
            },
            {
                title: "DAVID ET AL. 2019, THE ASTROPHYSICAL JOURNAL LETTERS",
                articleTitle: "Four Newborn Planets Transiting the Young Solar Analog V1298 Tau",
                url: "https://iopscience.iop.org/article/10.3847/2041-8213/ab4c99",
                summary: ""
            },
            {
                title: "DAVID ET AL. 2016, NATURE",
                articleTitle: "A Neptune-sized transiting planet closely orbiting a 5-10-million-year-old star.",
                url: "assets/nature18293.pdf",
                summary: "How planets end up in tight orbits close to their host stars is one of the oldest questions in exoplanet science. This paper reports the discovery of K2-33 b, the first close-in planetary companion to a newborn star, demonstrating that such planets can form extremely early. Because the planet's age is comparable to the lifetime of the protoplanetary disk - and to the canonical timescale of planet formation itself - the result points to rapid migration (e.g., via disk-driven tidal dissipation) or in situ formation, rather than slow, late processes. Notably, this timescale is also comparable to the divergence between humans and chimpanzees, meaning the planet has effectively grown up alongside our earliest ancestors."
            }
        ]
    }
];

window.publicationItems = publicationItems;

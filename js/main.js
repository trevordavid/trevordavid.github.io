// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    var themeToggle = document.getElementById("theme-toggle");

    var emailCopy = document.getElementById("email-copy");
    var emailLink = document.getElementById("email-link");
    
    var publicationsToggle = document.getElementById("publications-toggle");
    var publicationsItemsContainer = document.getElementById("publications-items");
    var pressToggle = document.getElementById("press-toggle");
    var pressItemsContainer = document.getElementById("press-items");

    // Initialize collapsible containers as hidden
    if (publicationsItemsContainer) {
        publicationsItemsContainer.style.display = "none";
    }
    if (pressItemsContainer) {
        pressItemsContainer.style.display = "none";
    }

    // Load publications items data
    loadPublicationItems();

    // Load press items data
    loadPressItems();

    // Configuration
    const siteConfig = {
        name: "trevor",
        siteUrl: "https://trevorjdavid.com/",
        // Email is encoded using Base64 for better protection against scrapers
        emailUser: "dHJldm9yamRhdmlk", // Base64 encoded "trevorjdavid"
        emailDomain: "Z21haWwuY29t" // Base64 encoded "gmail.com"
    };

    // Reconstruct email only when needed with decoding
    function getEmail() {
        return atob(siteConfig.emailUser) + "@" + atob(siteConfig.emailDomain);
    }

    // Apply site config
    document.title = siteConfig.name;
    document.querySelector('meta[name="description"]').setAttribute("content", siteConfig.name);
    document.querySelector('meta[property="og:description"]').setAttribute("content", siteConfig.name);
    document.querySelector('meta[property="og:url"]').setAttribute("content", siteConfig.siteUrl);

    var canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.setAttribute("href", siteConfig.siteUrl);
    }

    // More specific selector that won't affect press items
    const nameElement = document.querySelector('.content-container > .content-row:nth-child(3) .company-name');
    if (nameElement) {
        nameElement.textContent = siteConfig.name;
    }

    // Theme handling
    var themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var lightFaviconHref = "assets/favicon-globe-512x512.png";
    var darkFaviconHref = "assets/favicon-globe-inverted-512x512.png";

    function hasExplicitThemePreference() {
        return localStorage.getItem('theme') !== null;
    }

    function normalizeThemeValue(themeValue) {
        if (themeValue === "2") {
            return "1";
        }

        if (themeValue === "1" || themeValue === "3" || themeValue === "4") {
            return themeValue;
        }

        return null;
    }

    function isDarkVisualTheme(themeValue) {
        return themeValue === "3" || themeValue === "4";
    }

    function updateFavicon(themeValue) {
        var favicon = document.getElementById("site-favicon");
        if (!favicon) {
            return;
        }

        var useDarkFavicon = isDarkVisualTheme(themeValue);
        favicon.href = useDarkFavicon ? darkFaviconHref : lightFaviconHref;
    }

    function applyTheme(themeValue, persistTheme) {
        var normalizedThemeValue = normalizeThemeValue(themeValue);

        if (!normalizedThemeValue) {
            return;
        }

        document.documentElement.setAttribute('data-theme', normalizedThemeValue);
        if (persistTheme) {
            localStorage.setItem('theme', normalizedThemeValue);
        }
        updateFavicon(normalizedThemeValue);
    }

    var storedTheme = normalizeThemeValue(localStorage.getItem('theme'));
    var defaultTheme = themeMediaQuery.matches ? "4" : "1";
    var initialTheme = storedTheme || defaultTheme;

    applyTheme(initialTheme, false);

    if (themeMediaQuery.addEventListener) {
        themeMediaQuery.addEventListener('change', function(event) {
            if (!hasExplicitThemePreference()) {
                applyTheme(event.matches ? "4" : "1", false);
            }
        });
    }

    themeToggle.onclick = function() {
        var currentTheme = document.documentElement.getAttribute("data-theme");
        var targetTheme = "4";
        
        if (currentTheme === "1") { targetTheme = "3"; }
        else if (currentTheme === "3") { targetTheme = "4"; }
        else { targetTheme = "1"; }

        applyTheme(targetTheme, true);
    }

    // Email handling
    if (emailCopy) {
        emailCopy.onmouseenter = function() {
            const root = document.querySelector(":root");
            root.style.setProperty("--copy-text", `" [+]"`);
        }

        emailCopy.onfocus = function() {
            const root = document.querySelector(":root");
            root.style.setProperty("--copy-text", `" [+]"`);
        }

        emailCopy.onclick = function() {
            navigator.clipboard.writeText(getEmail());
            const root = document.querySelector(":root");
            root.style.setProperty("--copy-text", `" [COPIED]"`);
        }
    }

    if (emailLink) {
        emailLink.onclick = function() {
            window.location.href = "mailto:" + getEmail();
        }
    }

    function setToggleState(toggleButton, container, isVisible) {
        if (!toggleButton || !container) {
            return;
        }

        container.style.display = isVisible ? "block" : "none";
        toggleButton.setAttribute("aria-expanded", isVisible ? "true" : "false");

        var desktopIcon = toggleButton.querySelector(".toggle-icon");
        if (desktopIcon) {
            desktopIcon.textContent = isVisible ? "[-]" : "[+]";
        }

        var mobileIcon = toggleButton.querySelector(".mobile-only");
        if (mobileIcon) {
            mobileIcon.textContent = isVisible ? "[-]" : "[+]";
        }
    }

    function setupToggle(toggleButton, container) {
        if (!toggleButton || !container) {
            return;
        }

        let isVisible = false;
        setToggleState(toggleButton, container, isVisible);

        toggleButton.addEventListener('click', function() {
            isVisible = !isVisible;
            setToggleState(toggleButton, container, isVisible);
        });
    }

    setupToggle(publicationsToggle, publicationsItemsContainer);
    setupToggle(pressToggle, pressItemsContainer);

    function loadPublicationItems() {
        try {
            if (typeof window.publicationItems !== 'undefined' && Array.isArray(window.publicationItems)) {
                renderPublicationItems(window.publicationItems);
            } else {
                renderPublicationItems([
                    {
                        title: "GOOGLE SCHOLAR",
                        url: "https://scholar.google.com/citations?user=t12ArKcAAAAJ&hl=en"
                    }
                ]);
            }
        } catch (error) {
            console.error('Error loading publication data:', error);
            renderPublicationItems([
                {
                    title: "GOOGLE SCHOLAR",
                    url: "https://scholar.google.com/citations?user=t12ArKcAAAAJ&hl=en"
                }
            ]);
        }
    }

    function createPublicationLinkRow(item, itemClassName) {
        const row = document.createElement('div');
        row.className = itemClassName || 'content-row publication-item';

        const wrapper = document.createElement('div');
        wrapper.className = 'publication-item-wrapper';

        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'content-link';
        link.tabIndex = 1;

        if (item.url.toLowerCase().endsWith('.pdf')) {
            link.type = 'application/pdf';
        }

        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';

        const titleElement = document.createElement('span');
        titleElement.className = 'company-name';
        titleElement.textContent = item.title;
        textContainer.appendChild(titleElement);

        const mobileIndicator = document.createElement('span');
        mobileIndicator.className = 'mobile-only';
        mobileIndicator.textContent = '[↗]';
        textContainer.appendChild(mobileIndicator);

        link.appendChild(textContainer);
        wrapper.appendChild(link);

        if (item.summary) {
            const hoverDetailsElement = document.createElement('div');
            hoverDetailsElement.className = 'publication-hover-details';

            if (item.articleTitle) {
                const articleTitleElement = document.createElement('div');
                articleTitleElement.className = 'publication-article-title';
                articleTitleElement.textContent = item.articleTitle;
                hoverDetailsElement.appendChild(articleTitleElement);
            }

            const summaryElement = document.createElement('div');
            summaryElement.className = 'publication-summary';
            summaryElement.textContent = item.summary;
            hoverDetailsElement.appendChild(summaryElement);
            wrapper.appendChild(hoverDetailsElement);
        }

        row.appendChild(wrapper);
        return row;
    }

    function renderPublicationItems(items) {
        if (!publicationsItemsContainer) return;

        publicationsItemsContainer.textContent = '';

        items.forEach(item => {
            if (Array.isArray(item.items)) {
                const sectionRow = document.createElement('div');
                sectionRow.className = 'content-row publication-section';

                const sectionButton = document.createElement('button');
                sectionButton.className = 'content-switch publication-section-toggle';
                sectionButton.tabIndex = 1;

                const textContainer = document.createElement('div');
                textContainer.className = 'text-container';

                const titleElement = document.createElement('span');
                titleElement.className = 'company-name';
                titleElement.textContent = item.title;
                textContainer.appendChild(titleElement);

                const desktopIcon = document.createElement('span');
                desktopIcon.className = 'toggle-icon no-mobile';
                desktopIcon.textContent = '[+]';
                textContainer.appendChild(desktopIcon);

                const mobileIcon = document.createElement('span');
                mobileIcon.className = 'mobile-only';
                mobileIcon.textContent = '[+]';
                textContainer.appendChild(mobileIcon);

                sectionButton.appendChild(textContainer);
                sectionRow.appendChild(sectionButton);
                publicationsItemsContainer.appendChild(sectionRow);

                const subitemsContainer = document.createElement('div');
                subitemsContainer.className = 'publication-subitems';
                subitemsContainer.style.display = 'none';

                item.items.forEach(subitem => {
                    subitemsContainer.appendChild(
                        createPublicationLinkRow(subitem, 'content-row publication-item publication-detail-item')
                    );
                });

                publicationsItemsContainer.appendChild(subitemsContainer);
                setupToggle(sectionButton, subitemsContainer);
                return;
            }

            publicationsItemsContainer.appendChild(
                createPublicationLinkRow(item, 'content-row publication-item')
            );
        });
    }

    // Function to load press items from the global pressItems array
    function loadPressItems() {
        try {
            // Try using the global pressItems array defined in press-data.js
            if (typeof window.pressItems !== 'undefined' && Array.isArray(window.pressItems)) {
                renderPressItems(window.pressItems);
            } else {
                // Fallback items if no press data is available
                const fallbackItems = [
                    { title: "NY TIMES", url: "https://www.nytimes.com/2024/01/12/science/wasp-69b-tail-planet.html", date: "2024-01-12" },
                    { title: "SIMONS FOUNDATION", url: "https://www.simonsfoundation.org/2021/05/14/shrinking-planets-could-explain-mystery-of-universes-missing-worlds/", date: "2021-05-14" },
                    { title: "NATURE ASTRONOMY", url: "https://www.nature.com/articles/s41550-019-0981-y", date: "2019-11-27" }
                ];
                renderPressItems(fallbackItems);
            }
        } catch (error) {
            console.error('Error loading press data:', error);
            // Fallback items in case of error
            const fallbackItems = [
                { title: "NY TIMES", url: "https://www.nytimes.com/2024/01/12/science/wasp-69b-tail-planet.html", date: "2024-01-12" },
                { title: "SIMONS FOUNDATION", url: "https://www.simonsfoundation.org/2021/05/14/shrinking-planets-could-explain-mystery-of-universes-missing-worlds/", date: "2021-05-14" },
                { title: "NATURE ASTRONOMY", url: "https://www.nature.com/articles/s41550-019-0981-y", date: "2019-11-27" }
            ];
            renderPressItems(fallbackItems);
        }
    }

    // Function to render press items
    function renderPressItems(items) {
        if (!pressItemsContainer) return;
        
        // Clear any existing items
        pressItemsContainer.textContent = '';
        
        // Create and append each press item
        items.forEach(item => {
            // Detect if the URL is a PDF file
            const isPdf = item.url.toLowerCase().endsWith('.pdf');

            const itemElement = document.createElement('div');
            itemElement.className = 'content-row press-item';

            const link = document.createElement('a');
            link.href = item.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'content-link';
            link.tabIndex = 1;
            if (isPdf) {
                link.type = 'application/pdf';
            }

            const textContainer = document.createElement('div');
            textContainer.className = 'text-container';

            const labelGroup = document.createElement('div');
            labelGroup.className = 'press-label-group';

            const titleElement = document.createElement('span');
            titleElement.className = 'company-name';
            titleElement.textContent = item.title.replace(/ /g, '\u00a0');
            labelGroup.appendChild(titleElement);

            textContainer.appendChild(labelGroup);

            if (item.date) {
                const dateElement = document.createElement('span');
                dateElement.className = 'date-range';
                dateElement.textContent = formatDate(item.date, itemElement.classList.contains('press-item'));
                textContainer.appendChild(dateElement);
            }

            if (item.articleTitle) {
                const articleTitleElement = document.createElement('span');
                articleTitleElement.className = 'press-article-title';
                articleTitleElement.textContent = item.articleTitle;
                textContainer.appendChild(articleTitleElement);
            }

            const mobileIndicator = document.createElement('span');
            mobileIndicator.className = 'mobile-only';
            mobileIndicator.textContent = '[↗]';
            textContainer.appendChild(mobileIndicator);

            link.appendChild(textContainer);
            itemElement.appendChild(link);
            pressItemsContainer.appendChild(itemElement);
        });
    }

    // Helper function to format dates
    function formatDate(dateString, useFullDate) {
        if (!dateString) {
            return '';
        }

        if (useFullDate) {
            return dateString;
        }

        // Non-press rows still render their existing year/range text.
        return dateString.split('-')[0];
    }
}); 

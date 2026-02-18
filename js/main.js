// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    var themeToggle = document.getElementById("theme-toggle");

    var emailCopy = document.getElementById("email-copy");
    var emailLink = document.getElementById("email-link");
    
    var pressToggle = document.getElementById("press-toggle");
    var pressItemsContainer = document.getElementById("press-items");
    var toggleIcon = document.querySelector(".toggle-icon");

    // Link elements are no longer needed - links handled by HTML

    // Debug logging
    console.log('Press toggle element:', pressToggle);
    console.log('Press items container:', pressItemsContainer);
    console.log('Toggle icon:', toggleIcon);

    // Initialize press items container as hidden
    if (pressItemsContainer) {
        pressItemsContainer.style.display = "none";
    }

    // Load press items data
    loadPressItems();

    // Configuration
    const siteConfig = {
        name: "trevor",
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
        if (!themeValue) {
            return;
        }

        document.documentElement.setAttribute('data-theme', themeValue);
        if (persistTheme) {
            localStorage.setItem('theme', themeValue);
        }
        updateFavicon(themeValue);
    }

    var storedTheme = localStorage.getItem('theme');
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
        
        if (currentTheme === "1") { targetTheme = "2"; }
        else if (currentTheme === "2") { targetTheme = "3"; }
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

    // Links are handled by HTML href and target="_blank" attributes
    // No JavaScript event listeners needed - they were causing duplicate tabs

    // Press section toggle - completely rewritten
    if (pressToggle) {
        // Set initial state
        let isVisible = false;
        var updatePressToggle = function() {
            if (isVisible) {
                // Show press items
                pressItemsContainer.style.display = "block";
                // Update toggle icon
                document.querySelectorAll('.toggle-icon').forEach(icon => {
                    icon.textContent = "[-]";
                });
                pressToggle.setAttribute("aria-expanded", "true");
            } else {
                // Hide press items
                pressItemsContainer.style.display = "none";
                // Update toggle icon
                document.querySelectorAll('.toggle-icon').forEach(icon => {
                    icon.textContent = "[+]";
                });
                pressToggle.setAttribute("aria-expanded", "false");
            }
        };

        updatePressToggle();
        
        pressToggle.addEventListener('click', function() {
            // Toggle state
            isVisible = !isVisible;
            updatePressToggle();
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
        pressItemsContainer.innerHTML = '';
        
        // Create and append each press item
        items.forEach(item => {
            const title = item.title.replace(/ /g, '&nbsp;'); // Replace spaces with &nbsp;
            
            // Detect if the URL is a PDF file
            const isPdf = item.url.toLowerCase().endsWith('.pdf');
            
            const itemElement = document.createElement('div');
            itemElement.className = 'content-row press-item';
            
            // Add type attribute for PDFs to help browsers handle them properly
            const linkType = isPdf ? 'type="application/pdf"' : '';
            
            itemElement.innerHTML = `
                <a href="${item.url}" target="_blank" ${linkType} class="content-link" tabindex="1">
                    <div class="text-container">
                        <span class="company-name">${title}</span>
                        ${item.date ? `<span class="date-range">${formatDate(item.date)}</span>` : ''}
                        <span class="mobile-only">[↗]</span>
                    </div>
                </a>
            `;
            
            pressItemsContainer.appendChild(itemElement);
        });
    }

    // Helper function to format dates
    function formatDate(dateString) {
        // Optional: Format the date as needed
        // This simple version just extracts the year
        return dateString.split('-')[0];
    }
}); 

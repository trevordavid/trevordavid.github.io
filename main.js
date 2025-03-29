// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    var themeToggle = document.getElementById("theme-toggle");

    var emailCopy = document.getElementById("email-copy");
    var emailLink = document.getElementById("email-link");
    
    var pressToggle = document.getElementById("press-toggle");
    var pressItemsContainer = document.getElementById("press-items");
    var toggleIcon = document.querySelector(".toggle-icon");

    var link1 = document.getElementById("link-1");
    var link2 = document.getElementById("link-2");
    var link3 = document.getElementById("link-3");
    var link4 = document.getElementById("link-4");
    var link5 = document.getElementById("link-5");
    var link6 = document.getElementById("link-6");
    var link7 = document.getElementById("link-7");
    var link8 = document.getElementById("link-8");

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
        name: "TREVOR DAVID",
        // Email is stored in parts to avoid scrapers
        emailUser: "your.email",
        emailDomain: "example.com"
    };

    // Reconstruct email only when needed
    function getEmail() {
        return siteConfig.emailUser + "@" + siteConfig.emailDomain;
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
    var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "6" : "1");

    if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
    }

    themeToggle.onclick = function() {
        var currentTheme = document.documentElement.getAttribute("data-theme");
        var targetTheme = "6";
        
        if (currentTheme === "1") { targetTheme = "2"; }
        else if (currentTheme === "2") { targetTheme = "3"; }
        else if (currentTheme === "3") { targetTheme = "4"; }
        else if (currentTheme === "4") { targetTheme = "5"; }
        else if (currentTheme === "5") { targetTheme = "6"; }
        else if (currentTheme === "6") { targetTheme = "7"; }
        else { targetTheme = "1"; }

        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
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

    // Links - using addEventListener instead of onclick property
    if (link1) link1.addEventListener('click', function() {
        window.open("https://example.com/quantitative-researcher", '_blank');
    });

    if (link2) link2.addEventListener('click', function() {
        window.open("https://www.simonsfoundation.org/flatiron/center-for-computational-astrophysics/", '_blank');
    });

    if (link3) link3.addEventListener('click', function() {
        window.open("https://www.jpl.nasa.gov/", '_blank');
    });

    if (link4) link4.addEventListener('click', function() {
        window.open("https://www.caltech.edu/", '_blank');
    });

    if (link5) link5.addEventListener('click', function() {
        window.open("https://github.com/trevordavid/cv/blob/main/cv.pdf", '_blank');
    });

    if (link6) link6.addEventListener('click', function() {
        window.open("https://github.com/trevordavid/portfolio/", '_blank');
    });

    if (link7) link7.addEventListener('click', function() {
        window.open("https://github.com/trevordavid", '_blank');
    });

    if (link8) link8.addEventListener('click', function() {
        window.open("https://www.linkedin.com/in/trevor-j-david-30494017/", '_blank');
    });

    // Press section toggle - completely rewritten
    if (pressToggle) {
        // Set initial state
        let isVisible = false;
        updatePressToggle();
        
        pressToggle.addEventListener('click', function() {
            // Toggle state
            isVisible = !isVisible;
            updatePressToggle();
        });
        
        // Function to update the UI based on the current state
        function updatePressToggle() {
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
        }
    }

    // Function to load press items from the global pressItems array
    function loadPressItems() {
        try {
            // Try using the global pressItems array defined in press-data.js
            if (typeof window.pressItems !== 'undefined' && Array.isArray(window.pressItems)) {
                renderPressItems(window.pressItems);
            } else if (typeof pressItems !== 'undefined' && Array.isArray(pressItems)) {
                renderPressItems(pressItems);
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
            
            const itemElement = document.createElement('div');
            itemElement.className = 'content-row press-item';
            
            itemElement.innerHTML = `
                <a href="${item.url}" target="_blank" class="content-link" tabindex="1">
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
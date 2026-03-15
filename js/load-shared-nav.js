// Creating reusable nav header so I dont need to copy past and update nav everywhere since I plan to use this site to contain all of my assignments...

document.addEventListener("DOMContentLoaded", async () => {
    const mount = document.getElementById("shared-site-nav");
    if (!mount) {
        return;
    }

    const source = mount.dataset.navSrc || "/partials/site-header-nav.html";
    const currentPage = mount.dataset.currentPage || "";
    const navTemplate = `
<div class="site-header">
    <h1>Savannah Kestral</h1>
    <hr>
</div>

<div class="site-nav" role="navigation" aria-label="Main">
    <a href="/index.html" data-nav-key="home">Home</a>
    <a href="/about.html" data-nav-key="about">About</a>
    <a href="/contact.html" data-nav-key="contact">Contact</a>
    <div class="nav-dropdown">
        <a href="/hw1/index.html" data-nav-key="assignments">Assignments</a>
        <div class="nav-dropdown-menu">
            <a href="/hw1/index.html" data-nav-key="hw1">HW 1</a>
            <a href="/lab2_guessing_game/index.html" data-nav-key="lab2">Lab 2 Guessing Game</a>
        </div>
    </div>
</div>`;

    const hw1SubNavTemplate = `
<div class="hw1-sub-nav" role="navigation" aria-label="HW1 Sections">
    <a href="/hw1/index.html" data-nav-key="hw1-index">Overview</a>
    <a href="/hw1/power-platform.html" data-nav-key="hw1-power-platform">Power Platform</a>
    <a href="/hw1/alm.html" data-nav-key="hw1-alm">ALM</a>
    <a href="/hw1/azure-devops.html" data-nav-key="hw1-azure-devops">Azure DevOps</a>
    <a href="/hw1/governance.html" data-nav-key="hw1-governance">Governance</a>
</div>`;

    const isHw1Page = () => currentPage === "hw1" || window.location.pathname.includes("/hw1/");

    const injectHw1SubNav = () => {
        if (!isHw1Page() || mount.querySelector(".hw1-sub-nav")) {
            return;
        }
        mount.insertAdjacentHTML("beforeend", hw1SubNavTemplate);
    };

    const applyHw1ActiveState = () => {
        if (!isHw1Page()) {
            return;
        }

        const fileName = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        const fileToKey = {
            "index.html": "hw1-index",
            "power-platform.html": "hw1-power-platform",
            "alm.html": "hw1-alm",
            "azure-devops.html": "hw1-azure-devops",
            "governance.html": "hw1-governance"
        };

        const activeKey = fileToKey[fileName] || "hw1-index";
        const activeSectionLink = mount.querySelector(`[data-nav-key="${activeKey}"]`);
        if (activeSectionLink) {
            activeSectionLink.classList.add("active-link");
        }
    };

    const applyActiveState = () => {
        if (!currentPage) {
            return;
        }

        const activeLink = mount.querySelector(`[data-nav-key="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add("active-link");
        }

        if (currentPage === "hw1" || currentPage === "lab2") {
            const assignmentsLink = mount.querySelector('[data-nav-key="assignments"]');
            if (assignmentsLink) {
                assignmentsLink.classList.add("active-link");
            }
        }
    };

    const applyLocalFileHrefs = () => {
        if (window.location.protocol !== "file:") {
            return;
        }

        const pathname = window.location.pathname;
        const markers = ["/hw1/", "/lab2_guessing_game/"];
        let rootPath = pathname.slice(0, pathname.lastIndexOf("/"));

        for (const marker of markers) {
            const markerIndex = pathname.indexOf(marker);
            if (markerIndex !== -1) {
                rootPath = pathname.slice(0, markerIndex);
                break;
            }
        }

        const rootUrl = new URL(`file://${rootPath.endsWith("/") ? rootPath : `${rootPath}/`}`);
        const hrefMap = {
            home: "index.html",
            about: "about.html",
            contact: "contact.html",
            assignments: "hw1/index.html",
            hw1: "hw1/index.html",
            lab2: "lab2_guessing_game/index.html",
            "hw1-index": "hw1/index.html",
            "hw1-power-platform": "hw1/power-platform.html",
            "hw1-alm": "hw1/alm.html",
            "hw1-azure-devops": "hw1/azure-devops.html",
            "hw1-governance": "hw1/governance.html"
        };

        Object.entries(hrefMap).forEach(([key, relPath]) => {
            const link = mount.querySelector(`[data-nav-key="${key}"]`);
            if (link) {
                link.setAttribute("href", new URL(relPath, rootUrl).href);
            }
        });
    };

    // Browsers often block fetch() for local file:// pages, so use embedded markup.
    if (window.location.protocol === "file:") {
        mount.innerHTML = navTemplate;
        injectHw1SubNav();
        applyLocalFileHrefs();
        applyActiveState();
        applyHw1ActiveState();
        return;
    }

    try {
        const response = await fetch(source);
        if (!response.ok) {
            throw new Error(`Failed to load nav: ${response.status}`);
        }

        const navMarkup = await response.text();
        mount.innerHTML = navMarkup;
        injectHw1SubNav();
        applyLocalFileHrefs();
        applyActiveState();
        applyHw1ActiveState();
    } catch (error) {
        console.error(error);
        mount.innerHTML = navTemplate;
        injectHw1SubNav();
        applyLocalFileHrefs();
        applyActiveState();
        applyHw1ActiveState();
    }
});
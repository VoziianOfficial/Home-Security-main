

(() => {
    "use strict";




    const config =
        window.SITE_CONFIG || {};

    const body =
        document.body;

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;




    const $ = (
        selector,
        context = document
    ) => context.querySelector(selector);


    const $$ = (
        selector,
        context = document
    ) => [
        ...context.querySelectorAll(selector)
    ];


    const setText = (
        selector,
        value
    ) => {
        if (
            value === undefined ||
            value === null
        ) {
            return;
        }

        $$(selector).forEach(
            (element) => {
                element.textContent =
                    String(value);
            }
        );
    };


    const setAttribute = (
        selector,
        attribute,
        value
    ) => {
        if (
            value === undefined ||
            value === null
        ) {
            return;
        }

        $$(selector).forEach(
            (element) => {
                element.setAttribute(
                    attribute,
                    String(value)
                );
            }
        );
    };


    const normalizeText = (
        value = ""
    ) => {
        return String(value)
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9\s&-]/g,
                ""
            );
    };




    function applySiteConfig() {
        applyBrand();

        applyEmail();

        applyDisclaimer();

        applyNavigationLabels();

        applyPageTitle();

        applyFavicon();
    }


    function applyBrand() {
        if (!config.brandName) {
            return;
        }

        const brandHomeLabel =
            `${config.brandName} home`;

        setText(
            "[data-config-brand]",
            config.brandName
        );


        setAttribute(
            "[data-config-brand-home-label]",
            "aria-label",
            brandHomeLabel
        );


        setAttribute(
            "[data-config-logo]",
            "alt",
            `${config.brandName} logo`
        );


        if (config.logo) {
            setAttribute(
                "[data-config-logo]",
                "src",
                config.logo
            );
        }
    }


    function applyEmail() {
        if (!config.email) {
            return;
        }



        setAttribute(
            "[data-config-email-link]",
            "href",
            `mailto:${config.email}`
        );


        setText(
            "[data-config-email]",
            config.email
        );


        setText(
            ".header-info__email[data-config-email-link]",
            config.email
        );
    }


    function applyDisclaimer() {
        if (!config.disclaimer) {
            return;
        }

        setText(
            "[data-config-disclaimer]",
            config.disclaimer
        );
    }


    function applyNavigationLabels() {
        const navigation =
            config.navigation || {};

        if (navigation.main) {
            setText(
                "[data-nav-main]",
                navigation.main
            );
        }

        if (navigation.about) {
            setText(
                "[data-nav-about]",
                navigation.about
            );
        }

        if (navigation.services) {
            setText(
                "[data-nav-services]",
                navigation.services
            );
        }

        if (navigation.contact) {
            setText(
                "[data-nav-contact]",
                navigation.contact
            );
        }
    }


    function applyPageTitle() {
        const pageKey =
            body.dataset.page || "home";

        const pageTitle =
            config.pages?.[pageKey]?.title;

        document.title =
            pageTitle ||
            config.browserTitle ||
            config.brandName ||
            document.title;
    }


    function applyFavicon() {
        if (!config.favicon) {
            return;
        }

        let favicon =
            document.querySelector(
                'link[rel="icon"]'
            );

        if (!favicon) {
            favicon =
                document.createElement(
                    "link"
                );

            favicon.rel =
                "icon";

            document.head.appendChild(
                favicon
            );
        }

        favicon.href =
            config.favicon;
    }




    function initActiveNavigation() {
        const pageKey =
            body.dataset.page || "home";

        const navigationItems =
            $$("[data-nav-page]");

        const servicePage =
            pageKey === "cameras" ||
            pageKey === "alarmAccess";


        navigationItems.forEach(
            (item) => {
                const target =
                    item.dataset.navPage;

                const active =
                    target === pageKey ||
                    (
                        target ===
                            "services" &&
                        servicePage
                    );

                item.classList.toggle(
                    "is-active",
                    active
                );


                if (
                    item.tagName === "A"
                ) {
                    if (active) {
                        item.setAttribute(
                            "aria-current",
                            "page"
                        );
                    } else {
                        item.removeAttribute(
                            "aria-current"
                        );
                    }
                }
            }
        );
    }




    function initHeader() {
        const header =
            $(".site-header");

        if (!header) {
            return;
        }

        let ticking =
            false;


        function updateHeader() {
            header.classList.toggle(
                "is-scrolled",
                window.scrollY > 24
            );

            ticking =
                false;
        }


        window.addEventListener(
            "scroll",
            () => {
                if (ticking) {
                    return;
                }

                ticking =
                    true;

                window.requestAnimationFrame(
                    updateHeader
                );
            },
            {
                passive: true
            }
        );


        updateHeader();
    }




    function initMobileMenu() {
        const toggle =
            $(".menu-toggle");

        const menu =
            $(".mobile-menu");

        if (
            !toggle ||
            !menu
        ) {
            return;
        }

        const lines =
            $$(
                ".menu-toggle__line",
                toggle
            );

        let previousFocus =
            null;


        function openMenu() {
            previousFocus =
                document.activeElement;

            menu.classList.add(
                "is-open"
            );

            body.classList.add(
                "menu-open"
            );

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );

            toggle.setAttribute(
                "aria-label",
                "Close menu"
            );


            if (
                lines.length >= 2
            ) {
                lines[0].style.transform =
                    "translateY(3.25px) rotate(45deg)";

                lines[1].style.transform =
                    "translateY(-3.25px) rotate(-45deg)";
            }


            const firstLink =
                $("a", menu);

            window.setTimeout(
                () => {
                    firstLink?.focus();
                },
                40
            );
        }


        function closeMenu(
            restoreFocus = false
        ) {
            menu.classList.remove(
                "is-open"
            );

            body.classList.remove(
                "menu-open"
            );

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

            toggle.setAttribute(
                "aria-label",
                "Open menu"
            );


            lines.forEach(
                (line) => {
                    line.style.transform =
                        "";
                }
            );


            if (
                restoreFocus &&
                previousFocus instanceof HTMLElement
            ) {
                previousFocus.focus();
            }
        }


        toggle.addEventListener(
            "click",
            () => {
                const open =
                    menu.classList.contains(
                        "is-open"
                    );

                if (open) {
                    closeMenu();
                } else {
                    openMenu();
                }
            }
        );


        $$("a", menu).forEach(
            (link) => {
                link.addEventListener(
                    "click",
                    () => {
                        closeMenu();
                    }
                );
            }
        );


        document.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Escape" &&
                    menu.classList.contains(
                        "is-open"
                    )
                ) {
                    closeMenu(true);
                }
            }
        );


        window.addEventListener(
            "resize",
            () => {
                if (
                    window.innerWidth >
                    1180
                ) {
                    closeMenu();
                }
            },
            {
                passive: true
            }
        );
    }




    function createSearchIndex() {
        const services =
            config.services || {};

        const navigation =
            config.navigation || {};

        return [
            {
                title:
                    navigation.main ||
                    "Main",
                description:
                    "Residential home security overview",
                href:
                    "index.html",
                keywords:
                    "home main residential security protection"
            },

            {
                title:
                    navigation.about ||
                    "About",
                description:
                    "Our approach to residential security",
                href:
                    "index.html#about",
                keywords:
                    "about trust protection philosophy"
            },

            {
                title:
                    services.cameras?.name ||
                    "Security Camera Systems",
                description:
                    "Camera coverage for entrances, driveways and exterior areas",
                href:
                    services.cameras?.url ||
                    "security-camera-systems.html",
                keywords:
                    "camera cameras cctv surveillance exterior driveway entrance video"
            },

            {
                title:
                    services.alarmAccess?.name ||
                    "Alarm & Access Control",
                description:
                    "Alarms, entry protection and access control",
                href:
                    services.alarmAccess?.url ||
                    "alarm-access-control.html",
                keywords:
                    "alarm alarms access control lock locks door entry sensor sensors"
            },

            {
                title:
                    "Protection Modes",
                description:
                    "Security for home, away, night and visitors",
                href:
                    "index.html#protection-modes",
                keywords:
                    "home away night visitor modes alarm security"
            },

            {
                title:
                    navigation.contact ||
                    "Contact",
                description:
                    "Request home security guidance",
                href:
                    "index.html#contact",
                keywords:
                    "contact email request quote guidance form"
            },

            {
                title:
                    "Privacy Policy",
                description:
                    "How website information is handled",
                href:
                    "privacy-policy.html",
                keywords:
                    "privacy policy data information"
            },

            {
                title:
                    "Terms & Conditions",
                description:
                    "Website terms and conditions",
                href:
                    "terms.html",
                keywords:
                    "terms conditions legal website"
            },

            {
                title:
                    "Cookie Policy",
                description:
                    "Browser storage and cookie information",
                href:
                    "cookies.html",
                keywords:
                    "cookie cookies storage local browser"
            }
        ];
    }




    function initSearch() {
        const panel =
            $("[data-search-panel]");

        const openButtons =
            $$("[data-search-open]");

        if (
            !panel ||
            !openButtons.length
        ) {
            return;
        }


        const closeButton =
            $(
                "[data-search-close]",
                panel
            );

        const form =
            $(
                "[data-search-form]",
                panel
            );

        const input =
            $(
                "[data-search-input]",
                panel
            );

        const results =
            $(
                "[data-search-results]",
                panel
            );

        const searchIndex =
            createSearchIndex();

        let previousFocus =
            null;


        function renderResults(
            query = ""
        ) {
            if (!results) {
                return;
            }

            const normalizedQuery =
                normalizeText(query);


            if (!normalizedQuery) {
                results.innerHTML = `
                    <a
                        class="search-result"
                        href="security-camera-systems.html"
                    >
                        <span>
                            Security Camera Systems
                        </span>
                        <span>
                            Cameras
                        </span>
                    </a>

                    <a
                        class="search-result"
                        href="alarm-access-control.html"
                    >
                        <span>
                            Alarm &amp; Access Control
                        </span>
                        <span>
                            Entry
                        </span>
                    </a>
                `;

                return;
            }


            const words =
                normalizedQuery
                    .split(/\s+/)
                    .filter(Boolean);


            const matches =
                searchIndex.filter(
                    (item) => {
                        const haystack =
                            normalizeText(
                                [
                                    item.title,
                                    item.description,
                                    item.keywords
                                ].join(" ")
                            );

                        return words.every(
                            (word) =>
                                haystack.includes(
                                    word
                                )
                        );
                    }
                );


            if (!matches.length) {
                results.innerHTML = `
                    <div class="search-result">
                        <span>
                            No matching page found
                        </span>
                    </div>
                `;

                return;
            }


            results.innerHTML =
                matches
                    .slice(0, 6)
                    .map(
                        (item) => `
                            <a
                                class="search-result"
                                href="${item.href}"
                            >
                                <span>
                                    ${item.title}
                                </span>

                                <span>
                                    ${item.description}
                                </span>
                            </a>
                        `
                    )
                    .join("");
        }


        function openSearch() {
            previousFocus =
                document.activeElement;

            panel.classList.add(
                "is-open"
            );

            panel.setAttribute(
                "aria-hidden",
                "false"
            );

            body.classList.add(
                "search-open"
            );

            renderResults(
                input?.value || ""
            );


            window.setTimeout(
                () => {
                    input?.focus();
                },
                60
            );
        }


        function closeSearch(
            restoreFocus = true
        ) {
            panel.classList.remove(
                "is-open"
            );

            panel.setAttribute(
                "aria-hidden",
                "true"
            );

            body.classList.remove(
                "search-open"
            );


            if (
                restoreFocus &&
                previousFocus instanceof HTMLElement
            ) {
                previousFocus.focus();
            }
        }


        openButtons.forEach(
            (button) => {
                button.addEventListener(
                    "click",
                    openSearch
                );
            }
        );


        closeButton?.addEventListener(
            "click",
            () => {
                closeSearch();
            }
        );


        panel.addEventListener(
            "click",
            (event) => {
                if (
                    event.target === panel
                ) {
                    closeSearch();
                }
            }
        );


        input?.addEventListener(
            "input",
            () => {
                renderResults(
                    input.value
                );
            }
        );


        form?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const firstResult =
                    results?.querySelector(
                        "a.search-result"
                    );

                if (firstResult) {
                    firstResult.click();
                }
            }
        );


        results?.addEventListener(
            "click",
            (event) => {
                const link =
                    event.target.closest(
                        "a"
                    );

                if (link) {
                    closeSearch(false);
                }
            }
        );


        document.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Escape" &&
                    panel.classList.contains(
                        "is-open"
                    )
                ) {
                    closeSearch();
                }
            }
        );




        panel.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key !== "Tab"
                ) {
                    return;
                }


                const focusable =
                    $$(
                        'button:not([disabled]), input:not([disabled]), a[href]',
                        panel
                    ).filter(
                        (element) =>
                            element.offsetParent !==
                            null
                    );


                if (!focusable.length) {
                    return;
                }


                const first =
                    focusable[0];

                const last =
                    focusable[
                        focusable.length - 1
                    ];


                if (
                    event.shiftKey &&
                    document.activeElement === first
                ) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        );
    }




    function initSmoothAnchors() {
        $$(
            'a[href^="#"]:not([href="#"])'
        ).forEach(
            (link) => {
                link.addEventListener(
                    "click",
                    (event) => {
                        const href =
                            link.getAttribute(
                                "href"
                            );

                        if (!href) {
                            return;
                        }

                        const target =
                            $(href);

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth",

                            block:
                                "start"
                        });
                    }
                );
            }
        );
    }




    function initAOS() {
        if (
            typeof window.AOS ===
            "undefined"
        ) {
            return;
        }


        window.AOS.init({
            duration:
                prefersReducedMotion
                    ? 0
                    : 760,

            easing:
                "ease-out-cubic",

            once:
                false,

            mirror:
                true,

            offset:
                42,

            delay:
                0,

            anchorPlacement:
                "top-bottom",

            disable:
                prefersReducedMotion
        });
    }




    function initAccordions() {
        const accordions =
            $$(".accordion");

        if (!accordions.length) {
            return;
        }


        accordions.forEach(
            (
                accordion,
                accordionIndex
            ) => {
                const items =
                    $$(
                        ".accordion__item",
                        accordion
                    );


                items.forEach(
                    (
                        item,
                        itemIndex
                    ) => {
                        const button =
                            $(
                                ".accordion__button",
                                item
                            );

                        const panel =
                            $(
                                ".accordion__panel",
                                item
                            );

                        if (
                            !button ||
                            !panel
                        ) {
                            return;
                        }


                        const baseId =
                            accordion.id ||
                            `accordion-${accordionIndex}`;


                        const buttonId =
                            `${baseId}-button-${itemIndex}`;

                        const panelId =
                            `${baseId}-panel-${itemIndex}`;


                        button.id =
                            button.id ||
                            buttonId;

                        panel.id =
                            panel.id ||
                            panelId;


                        button.setAttribute(
                            "aria-controls",
                            panel.id
                        );

                        panel.setAttribute(
                            "aria-labelledby",
                            button.id
                        );


                        const open =
                            item.classList.contains(
                                "is-open"
                            );


                        button.setAttribute(
                            "aria-expanded",
                            open
                                ? "true"
                                : "false"
                        );


                        panel.setAttribute(
                            "aria-hidden",
                            open
                                ? "false"
                                : "true"
                        );


                        button.addEventListener(
                            "click",
                            () => {
                                const currentlyOpen =
                                    item.classList.contains(
                                        "is-open"
                                    );


                                items.forEach(
                                    (otherItem) => {
                                        if (
                                            otherItem ===
                                            item
                                        ) {
                                            return;
                                        }


                                        otherItem.classList.remove(
                                            "is-open"
                                        );


                                        const otherButton =
                                            $(
                                                ".accordion__button",
                                                otherItem
                                            );

                                        const otherPanel =
                                            $(
                                                ".accordion__panel",
                                                otherItem
                                            );


                                        otherButton?.setAttribute(
                                            "aria-expanded",
                                            "false"
                                        );


                                        otherPanel?.setAttribute(
                                            "aria-hidden",
                                            "true"
                                        );
                                    }
                                );


                                item.classList.toggle(
                                    "is-open",
                                    !currentlyOpen
                                );


                                button.setAttribute(
                                    "aria-expanded",
                                    !currentlyOpen
                                        ? "true"
                                        : "false"
                                );


                                panel.setAttribute(
                                    "aria-hidden",
                                    !currentlyOpen
                                        ? "false"
                                        : "true"
                                );


                                accordion.dispatchEvent(
                                    new CustomEvent(
                                        "accordionchange",
                                        {
                                            bubbles:
                                                true,

                                            detail: {
                                                item,
                                                index:
                                                    itemIndex,

                                                open:
                                                    !currentlyOpen
                                            }
                                        }
                                    )
                                );
                            }
                        );
                    }
                );
            }
        );
    }




    function initContactForms() {
        const forms =
            $$("[data-contact-form]");

        if (!forms.length) {
            return;
        }


        forms.forEach(
            (form) => {
                const submitButton =
                    $(
                        '[type="submit"]',
                        form
                    );

                const status =
                    $(
                        ".form-status",
                        form
                    );

                const originalText =
                    submitButton
                        ?.textContent
                        ?.trim() ||
                    "Send Request";


                form.addEventListener(
                    "submit",
                    async (event) => {
                        event.preventDefault();


                        if (
                            !form.checkValidity()
                        ) {
                            form.reportValidity();
                            return;
                        }


                        status?.classList.remove(
                            "is-success",
                            "is-error"
                        );


                        if (status) {
                            status.textContent =
                                "";
                        }


                        if (submitButton) {
                            submitButton.disabled =
                                true;

                            submitButton.textContent =
                                "Sending...";
                        }


                        try {
                            const formData =
                                new FormData(
                                    form
                                );


                            const response =
                                await fetch(
                                    form.action ||
                                    "contact.php",
                                    {
                                        method:
                                            "POST",

                                        body:
                                            formData,

                                        headers: {
                                            "X-Requested-With":
                                                "XMLHttpRequest"
                                        }
                                    }
                                );


                            let data =
                                null;


                            const contentType =
                                response.headers.get(
                                    "content-type"
                                ) || "";


                            if (
                                contentType.includes(
                                    "application/json"
                                )
                            ) {
                                data =
                                    await response.json();
                            }


                            if (
                                !response.ok ||
                                data?.success ===
                                    false
                            ) {
                                throw new Error(
                                    data?.message ||
                                    "Request failed"
                                );
                            }


                            form.reset();




                            const serviceButtons =
                                $$(
                                    "[data-contact-service]",
                                    form
                                );

                            const serviceInput =
                                $(
                                    "[data-contact-service-input]",
                                    form
                                );


                            if (
                                serviceButtons.length
                            ) {
                                serviceButtons.forEach(
                                    (
                                        button,
                                        index
                                    ) => {
                                        button.classList.toggle(
                                            "is-active",
                                            index === 0
                                        );
                                    }
                                );


                                if (
                                    serviceInput &&
                                    serviceButtons[0]
                                ) {
                                    serviceInput.value =
                                        serviceButtons[0]
                                            .dataset
                                            .contactService ||
                                        "";
                                }
                            }


                            if (status) {
                                status.textContent =
                                    data?.message ||
                                    config.formSuccessMessage ||
                                    "Thank you! Your request has been sent successfully.";


                                status.classList.add(
                                    "is-success"
                                );
                            }
                        } catch (error) {
                            console.error(
                                "Contact form error:",
                                error
                            );


                            if (status) {
                                status.textContent =
                                    "Something went wrong. Please try again.";


                                status.classList.add(
                                    "is-error"
                                );
                            }
                        } finally {
                            if (submitButton) {
                                submitButton.disabled =
                                    false;

                                submitButton.textContent =
                                    originalText;
                            }
                        }
                    }
                );
            }
        );
    }




    function initCookieConsent() {
        const card =
            $(".cookie-card");

        if (!card) {
            return;
        }


        const acceptButton =
            $(
                "[data-cookie-accept]",
                card
            );


        const storageKey =
            "securenest-cookie-consent";


        let accepted =
            false;


        try {
            accepted =
                localStorage.getItem(
                    storageKey
                ) === "accepted";
        } catch (error) {
            accepted =
                false;
        }


        if (!accepted) {
            window.setTimeout(
                () => {
                    card.classList.add(
                        "is-visible"
                    );
                },
                prefersReducedMotion
                    ? 0
                    : 600
            );
        }


        acceptButton?.addEventListener(
            "click",
            () => {
                try {
                    localStorage.setItem(
                        storageKey,
                        "accepted"
                    );
                } catch (error) {

                }


                card.classList.remove(
                    "is-visible"
                );
            }
        );
    }




    function initRevealImages() {
        const images =
            $$(".reveal-image");

        if (!images.length) {
            return;
        }


        images.forEach(
            (image) => {
                const markLoaded =
                    () => {
                        image.classList.add(
                            "is-loaded"
                        );
                    };


                if (image.complete) {
                    markLoaded();
                    return;
                }


                image.addEventListener(
                    "load",
                    markLoaded,
                    {
                        once: true
                    }
                );


                image.addEventListener(
                    "error",
                    markLoaded,
                    {
                        once: true
                    }
                );
            }
        );
    }




    function initCurrentYear() {
        setText(
            "[data-current-year]",
            new Date().getFullYear()
        );
    }




    function secureExternalLinks() {
        $$(
            'a[target="_blank"]'
        ).forEach(
            (link) => {
                const relValues =
                    new Set(
                        (
                            link.getAttribute(
                                "rel"
                            ) || ""
                        )
                            .split(/\s+/)
                            .filter(Boolean)
                    );


                relValues.add(
                    "noopener"
                );

                relValues.add(
                    "noreferrer"
                );


                link.setAttribute(
                    "rel",
                    [
                        ...relValues
                    ].join(" ")
                );
            }
        );
    }




    function refreshAOSAfterLoad() {
        window.addEventListener(
            "load",
            () => {
                if (
                    typeof window.AOS ===
                    "undefined"
                ) {
                    return;
                }


                window.setTimeout(
                    () => {
                        window.AOS.refreshHard();
                    },
                    120
                );
            },
            {
                once: true
            }
        );
    }




    function init() {
        applySiteConfig();

        initActiveNavigation();

        initHeader();

        initMobileMenu();

        initSearch();

        initSmoothAnchors();

        initAccordions();

        initContactForms();

        initCookieConsent();

        initRevealImages();

        initCurrentYear();

        secureExternalLinks();

        initAOS();

        refreshAOSAfterLoad();
    }


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );
    } else {
        init();
    }

})();

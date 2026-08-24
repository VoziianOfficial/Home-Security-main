

(() => {
    "use strict";




    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const canHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
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


    const clamp = (
        value,
        min,
        max
    ) => Math.min(
        Math.max(value, min),
        max
    );




    function initServiceHero() {
        const hero =
            $(".service-hero");

        if (!hero) {
            return;
        }


        const image =
            $(".service-hero__image", hero);


        const revealHero = () => {
            hero.classList.add(
                "is-ready"
            );
        };


        if (!image) {
            revealHero();
            return;
        }


        if (image.complete) {
            revealHero();
            return;
        }


        image.addEventListener(
            "load",
            revealHero,
            {
                once: true
            }
        );




        image.addEventListener(
            "error",
            revealHero,
            {
                once: true
            }
        );
    }




    function ensureLoopSlides(
        slider,
        minimum = 8
    ) {
        if (!slider) {
            return;
        }


        const wrapper =
            $(".swiper-wrapper", slider);

        if (!wrapper) {
            return;
        }


        const existing =
            $$(".swiper-slide", wrapper);


        if (!existing.length) {
            return;
        }




        if (
            existing.some(
                (slide) =>
                    slide.dataset.loopClone ===
                    "true"
            )
        ) {
            return;
        }


        const originals =
            [...existing];


        let total =
            originals.length;

        let sourceIndex =
            0;


        while (
            total < minimum
        ) {
            const source =
                originals[
                    sourceIndex %
                    originals.length
                ];


            const clone =
                source.cloneNode(true);


            clone.dataset.loopClone =
                "true";


            clone.setAttribute(
                "aria-hidden",
                "true"
            );


            wrapper.appendChild(
                clone
            );


            total += 1;
            sourceIndex += 1;
        }
    }




    function initServiceScenes() {
        const sliders =
            $$(".service-scenes__slider");


        if (
            !sliders.length ||
            typeof window.Swiper ===
                "undefined"
        ) {
            return;
        }


        sliders.forEach(
            (slider) => {
                ensureLoopSlides(
                    slider,
                    8
                );


                const section =
                    slider.closest(
                        ".service-scenes"
                    );


                const previous =
                    $(
                        ".service-scenes__prev",
                        section
                    );


                const next =
                    $(
                        ".service-scenes__next",
                        section
                    );


                const pagination =
                    $(
                        ".service-scenes__pagination",
                        section
                    );


                const swiper =
                    new window.Swiper(
                        slider,
                        {
                            loop:
                                true,

                            slidesPerView:
                                "auto",

                            spaceBetween:
                                10,

                            speed:
                                prefersReducedMotion
                                    ? 0
                                    : 820,

                            grabCursor:
                                true,

                            slideToClickedSlide:
                                true,

                            watchSlidesProgress:
                                true,

                            observer:
                                true,

                            observeParents:
                                true,

                            resizeObserver:
                                true,

                            loopAdditionalSlides:
                                2,

                            autoplay:
                                prefersReducedMotion
                                    ? false
                                    : {
                                        delay:
                                            4700,

                                        disableOnInteraction:
                                            false,

                                        pauseOnMouseEnter:
                                            true
                                    },

                            navigation: {
                                prevEl:
                                    previous,

                                nextEl:
                                    next
                            },

                            pagination:
                                pagination
                                    ? {
                                        el:
                                            pagination,

                                        clickable:
                                            true
                                    }
                                    : undefined,

                            on: {
                                init(instance) {
                                    refreshExpandedSlider(
                                        instance
                                    );
                                },

                                slideChangeTransitionStart(
                                    instance
                                ) {
                                    refreshExpandedSlider(
                                        instance
                                    );
                                },

                                transitionEnd(
                                    instance
                                ) {
                                    refreshExpandedSlider(
                                        instance
                                    );
                                },

                                resize(instance) {
                                    refreshExpandedSlider(
                                        instance
                                    );
                                }
                            }
                        }
                    );




                window.setTimeout(
                    () => {
                        refreshExpandedSlider(
                            swiper
                        );

                        refreshAOS();
                    },
                    160
                );
            }
        );
    }


    function refreshExpandedSlider(
        swiper
    ) {
        if (
            !swiper ||
            swiper.destroyed
        ) {
            return;
        }


        window.setTimeout(
            () => {
                if (
                    !swiper ||
                    swiper.destroyed
                ) {
                    return;
                }


                swiper.updateSize();

                swiper.updateSlides();

                swiper.updateProgress();

                swiper.updateSlidesClasses();
            },
            prefersReducedMotion
                ? 0
                : 80
        );
    }




    function initSystemDiagram() {
        const diagrams =
            $$(".service-system__canvas");


        diagrams.forEach(
            (diagram) => {
                const nodes =
                    $$(
                        "[data-system-node]",
                        diagram
                    );


                if (!nodes.length) {
                    return;
                }


                function activateNode(
                    target
                ) {
                    nodes.forEach(
                        (node) => {
                            const active =
                                node === target;


                            node.classList.toggle(
                                "is-active",
                                active
                            );


                            node.setAttribute(
                                "aria-pressed",
                                active
                                    ? "true"
                                    : "false"
                            );
                        }
                    );
                }


                nodes.forEach(
                    (node) => {
                        node.setAttribute(
                            "aria-pressed",
                            node.classList.contains(
                                "is-active"
                            )
                                ? "true"
                                : "false"
                        );


                        node.addEventListener(
                            "click",
                            () => {
                                activateNode(
                                    node
                                );
                            }
                        );


                        node.addEventListener(
                            "focus",
                            () => {
                                activateNode(
                                    node
                                );
                            }
                        );


                        if (canHover) {
                            node.addEventListener(
                                "pointerenter",
                                () => {
                                    activateNode(
                                        node
                                    );
                                }
                            );
                        }
                    }
                );
            }
        );
    }




    function initServiceVisualFAQ() {
        const sections =
            $$(".service-visual-faq");


        sections.forEach(
            (section) => {
                const accordion =
                    $(".accordion", section);


                const images =
                    $$(
                        "[data-service-faq-image]",
                        section
                    );


                if (
                    !accordion ||
                    !images.length
                ) {
                    return;
                }


                function activateImage(
                    index
                ) {
                    images.forEach(
                        (image) => {
                            const imageIndex =
                                Number(
                                    image.dataset
                                        .serviceFaqImage
                                );


                            image.classList.toggle(
                                "is-active",
                                imageIndex ===
                                    Number(index)
                            );
                        }
                    );
                }


                accordion.addEventListener(
                    "accordionchange",
                    (event) => {
                        const detail =
                            event.detail;


                        if (
                            !detail ||
                            !detail.open
                        ) {
                            return;
                        }


                        const index =
                            detail.item
                                ?.dataset
                                .serviceFaqIndex;


                        if (
                            index === undefined
                        ) {
                            return;
                        }


                        activateImage(
                            index
                        );
                    }
                );


                $$(
                    ".accordion__item",
                    accordion
                ).forEach(
                    (item) => {
                        const button =
                            $(
                                ".accordion__button",
                                item
                            );


                        const index =
                            item.dataset
                                .serviceFaqIndex;


                        button?.addEventListener(
                            "focus",
                            () => {
                                activateImage(
                                    index
                                );
                            }
                        );


                        if (canHover) {
                            button?.addEventListener(
                                "pointerenter",
                                () => {
                                    activateImage(
                                        index
                                    );
                                }
                            );
                        }
                    }
                );
            }
        );
    }




    function initServiceSideNavigation() {
        const navigation =
            $(".service-side-nav");


        if (!navigation) {
            return;
        }


        const links =
            $$(
                ".service-side-nav__link",
                navigation
            );


        if (!links.length) {
            return;
        }


        const items =
            [];


        links.forEach(
            (link) => {
                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    !href.startsWith("#")
                ) {
                    return;
                }


                const section =
                    $(href);


                if (!section) {
                    return;
                }


                items.push({
                    link,
                    section
                });
            }
        );


        if (!items.length) {
            return;
        }


        function setActive(
            activeLink
        ) {
            links.forEach(
                (link) => {
                    const active =
                        link === activeLink;


                    link.classList.toggle(
                        "is-active",
                        active
                    );


                    if (active) {
                        link.setAttribute(
                            "aria-current",
                            "location"
                        );
                    } else {
                        link.removeAttribute(
                            "aria-current"
                        );
                    }
                }
            );
        }




        items.forEach(
            ({
                link,
                section
            }) => {
                link.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();


                        section.scrollIntoView({
                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth",

                            block:
                                "start"
                        });


                        setActive(
                            link
                        );
                    }
                );
            }
        );




        if (
            "IntersectionObserver"
            in window
        ) {
            const visibility =
                new Map();


            const observer =
                new IntersectionObserver(
                    (entries) => {
                        entries.forEach(
                            (entry) => {
                                visibility.set(
                                    entry.target,
                                    entry.intersectionRatio
                                );
                            }
                        );


                        let bestItem =
                            null;

                        let bestRatio =
                            0;


                        items.forEach(
                            (item) => {
                                const ratio =
                                    visibility.get(
                                        item.section
                                    ) || 0;


                                if (
                                    ratio >
                                    bestRatio
                                ) {
                                    bestRatio =
                                        ratio;

                                    bestItem =
                                        item;
                                }
                            }
                        );


                        if (
                            bestItem &&
                            bestRatio > 0
                        ) {
                            setActive(
                                bestItem.link
                            );
                        }
                    },
                    {
                        root:
                            null,

                        rootMargin:
                            "-22% 0px -50% 0px",

                        threshold: [
                            0,
                            0.08,
                            0.15,
                            0.25,
                            0.4,
                            0.6
                        ]
                    }
                );


            items.forEach(
                ({
                    section
                }) => {
                    observer.observe(
                        section
                    );
                }
            );
        }


        setActive(
            items[0].link
        );
    }




    function initServiceParallax() {
        if (
            prefersReducedMotion ||
            window.innerWidth < 768
        ) {
            return;
        }


        const images =
            $$(
                ".service-story__image"
            );


        if (!images.length) {
            return;
        }


        let ticking =
            false;


        function update() {
            const viewportHeight =
                window.innerHeight;


            const viewportCenter =
                viewportHeight / 2;


            images.forEach(
                (image) => {
                    const container =
                        image.parentElement;


                    if (!container) {
                        return;
                    }


                    const rect =
                        container
                            .getBoundingClientRect();


                    if (
                        rect.bottom < 0 ||
                        rect.top >
                            viewportHeight
                    ) {
                        return;
                    }


                    const center =
                        rect.top +
                        rect.height / 2;


                    const relative =
                        (
                            viewportCenter -
                            center
                        ) /
                        viewportHeight;


                    const offset =
                        clamp(
                            relative * 9,
                            -4.5,
                            4.5
                        );


                    image.style.objectPosition =
                        `center ${50 + offset}%`;
                }
            );


            ticking =
                false;
        }


        function requestUpdate() {
            if (ticking) {
                return;
            }


            ticking =
                true;


            window.requestAnimationFrame(
                update
            );
        }


        window.addEventListener(
            "scroll",
            requestUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            requestUpdate,
            {
                passive: true
            }
        );


        update();
    }




    function initCapabilities() {
        if (!canHover) {
            return;
        }


        const rails =
            $$(".service-capabilities__rail");


        rails.forEach(
            (rail) => {
                const items =
                    $$(
                        ".service-capability",
                        rail
                    );


                items.forEach(
                    (item) => {
                        item.addEventListener(
                            "pointerenter",
                            () => {
                                items.forEach(
                                    (other) => {
                                        other.style.opacity =
                                            other === item
                                                ? "1"
                                                : "0.68";
                                    }
                                );
                            }
                        );
                    }
                );


                rail.addEventListener(
                    "pointerleave",
                    () => {
                        items.forEach(
                            (item) => {
                                item.style.opacity =
                                    "";
                            }
                        );
                    }
                );
            }
        );
    }




    function initSectionVisibility() {
        const sections =
            $$(
                ".service-page main section"
            );


        if (
            !sections.length ||
            !(
                "IntersectionObserver"
                in window
            )
        ) {
            return;
        }


        const observer =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach(
                        (entry) => {
                            entry.target.classList.toggle(
                                "is-in-view",
                                entry.isIntersecting
                            );
                        }
                    );
                },
                {
                    threshold:
                        0.08,

                    rootMargin:
                        "-3% 0px -4% 0px"
                }
            );


        sections.forEach(
            (section) => {
                observer.observe(
                    section
                );
            }
        );
    }




    function initResponsiveRefresh() {
        let previousWidth =
            window.innerWidth;


        window.addEventListener(
            "resize",
            () => {
                const currentWidth =
                    window.innerWidth;


                if (
                    Math.abs(
                        currentWidth -
                        previousWidth
                    ) < 30
                ) {
                    return;
                }


                previousWidth =
                    currentWidth;


                if (
                    typeof window.AOS !==
                    "undefined"
                ) {
                    window.AOS.refresh();
                }
            },
            {
                passive: true
            }
        );
    }




    function refreshAOS() {
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
            150
        );
    }




    function init() {
        initServiceHero();

        initServiceScenes();

        initSystemDiagram();

        initServiceVisualFAQ();

        initServiceSideNavigation();

        initServiceParallax();

        initCapabilities();

        initSectionVisibility();

        initResponsiveRefresh();

        refreshAOS();
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

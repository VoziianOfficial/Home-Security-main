

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


    const toCssImagePath = path => {
        if (
            path.startsWith("/") ||
            path.includes("://") ||
            path.startsWith("data:")
        ) {
            return path;
        }

        return path.replace(
            /^assets\/images\//,
            "../images/"
        );
    };




    function initHero() {
        const hero =
            $(".hero");

        if (!hero) {
            return;
        }


        const scenes =
            $$(".hero__scene", hero);

        if (!scenes.length) {
            return;
        }


        const currentElement =
            $(".hero__progress-current", hero);

        const totalElement =
            $(".hero__progress-total", hero);

        const progressBar =
            $(".hero__progress-bar", hero);


        const interval =
            3000;

        const transitionDuration =
            980;


        let currentIndex =
            0;

        let timer =
            null;

        let transitioning =
            false;




        scenes.forEach(
            (scene) => {
                const image =
                    scene.dataset.heroImage;

                if (!image) {
                    return;
                }


                if (
                    scene.querySelector(
                        ".hero__strips"
                    )
                ) {
                    return;
                }


                const stripContainer =
                    document.createElement(
                        "div"
                    );

                stripContainer.className =
                    "hero__strips";


                const fragment =
                    document.createDocumentFragment();


                for (
                    let index = 0;
                    index < 10;
                    index += 1
                ) {
                    const strip =
                        document.createElement(
                            "span"
                        );

                    strip.className =
                        "hero__strip";

                    strip.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                    strip.style.setProperty(
                        "--hero-image",
                        `url("${toCssImagePath(image)}")`
                    );

                    fragment.appendChild(
                        strip
                    );
                }


                stripContainer.appendChild(
                    fragment
                );

                scene.appendChild(
                    stripContainer
                );
            }
        );




        const formatNumber =
            (number) =>
                String(number)
                    .padStart(
                        2,
                        "0"
                    );


        if (totalElement) {
            totalElement.textContent =
                formatNumber(
                    scenes.length
                );
        }


        function updateCounter() {
            if (!currentElement) {
                return;
            }

            currentElement.textContent =
                formatNumber(
                    currentIndex + 1
                );
        }




        function restartProgress() {
            if (!progressBar) {
                return;
            }


            progressBar.classList.remove(
                "is-running"
            );




            void progressBar.offsetWidth;


            if (
                !prefersReducedMotion &&
                scenes.length > 1
            ) {
                progressBar.classList.add(
                    "is-running"
                );
            }
        }




        function showScene(
            nextIndex,
            initial = false
        ) {
            if (
                transitioning &&
                !initial
            ) {
                return;
            }


            const previousIndex =
                currentIndex;

            const previousScene =
                scenes[previousIndex];

            const nextScene =
                scenes[nextIndex];


            if (!nextScene) {
                return;
            }


            if (
                previousScene ===
                    nextScene &&
                !initial
            ) {
                return;
            }


            transitioning =
                true;


            scenes.forEach(
                (scene) => {
                    scene.classList.remove(
                        "is-leaving"
                    );
                }
            );


            if (
                !initial &&
                previousScene &&
                previousScene !==
                    nextScene
            ) {
                previousScene.classList.add(
                    "is-leaving"
                );
            }


            nextScene.classList.add(
                "is-active"
            );

            nextScene.setAttribute(
                "aria-hidden",
                "false"
            );


            currentIndex =
                nextIndex;


            updateCounter();

            restartProgress();


            window.setTimeout(
                () => {
                    scenes.forEach(
                        (
                            scene,
                            index
                        ) => {
                            if (
                                index ===
                                currentIndex
                            ) {
                                scene.classList.remove(
                                    "is-leaving"
                                );

                                scene.classList.add(
                                    "is-active"
                                );

                                scene.setAttribute(
                                    "aria-hidden",
                                    "false"
                                );

                                return;
                            }


                            scene.classList.remove(
                                "is-active",
                                "is-leaving"
                            );

                            scene.setAttribute(
                                "aria-hidden",
                                "true"
                            );
                        }
                    );


                    transitioning =
                        false;
                },
                initial
                    ? 80
                    : transitionDuration
            );
        }


        function nextScene() {
            const nextIndex =
                (
                    currentIndex + 1
                ) %
                scenes.length;


            showScene(
                nextIndex
            );
        }




        function stopTimer() {
            if (!timer) {
                return;
            }

            window.clearInterval(
                timer
            );

            timer =
                null;
        }


        function startTimer() {
            stopTimer();


            if (
                scenes.length <= 1 ||
                prefersReducedMotion
            ) {
                return;
            }


            timer =
                window.setInterval(
                    nextScene,
                    interval
                );
        }




        scenes.forEach(
            (scene) => {
                scene.classList.remove(
                    "is-active",
                    "is-leaving"
                );

                scene.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        );


        currentIndex =
            0;




        window.requestAnimationFrame(
            () => {
                window.requestAnimationFrame(
                    () => {
                        showScene(
                            0,
                            true
                        );
                    }
                );
            }
        );


        startTimer();




        document.addEventListener(
            "visibilitychange",
            () => {
                if (
                    document.hidden
                ) {
                    stopTimer();

                    progressBar
                        ?.classList
                        .remove(
                            "is-running"
                        );

                    return;
                }


                restartProgress();

                startTimer();
            }
        );
    }




    function initSecurityScenarios() {
        const slider =
            $(".security-scenarios__slider");

        if (
            !slider ||
            typeof window.Swiper ===
                "undefined"
        ) {
            return;
        }


        const section =
            slider.closest(
                ".security-scenarios"
            );


        const previous =
            $(
                ".security-scenarios__prev",
                section
            );

        const next =
            $(
                ".security-scenarios__next",
                section
            );

        const pagination =
            $(
                ".security-scenarios__pagination",
                section
            );


        const swiper =
            new window.Swiper(
                slider,
                {
                    loop:
                        false,

                    rewind:
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
                            refreshScenarioGeometry(
                                instance
                            );
                        },

                        slideChangeTransitionStart(
                            instance
                        ) {
                            refreshScenarioGeometry(
                                instance
                            );
                        },

                        resize(instance) {
                            refreshScenarioGeometry(
                                instance
                            );
                        }
                    }
                }
            );




        function refreshScenarioGeometry(
            instance
        ) {
            window.setTimeout(
                () => {
                    if (
                        !instance ||
                        instance.destroyed
                    ) {
                        return;
                    }


                    instance.updateSlides();

                    instance.updateProgress();

                    instance.updateSlidesClasses();
                },
                prefersReducedMotion
                    ? 0
                    : 90
            );
        }


        return swiper;
    }




    function initProtectionMap() {
        const map =
            $(".protection-map__canvas");

        if (!map) {
            return;
        }


        const zones =
            $$(
                ".protection-map__zone",
                map
            );


        if (!zones.length) {
            return;
        }


        function activateZone(
            target
        ) {
            zones.forEach(
                (zone) => {
                    zone.classList.toggle(
                        "is-active",
                        zone === target
                    );
                }
            );
        }


        zones.forEach(
            (zone) => {
                zone.addEventListener(
                    "click",
                    () => {
                        activateZone(
                            zone
                        );
                    }
                );


                zone.addEventListener(
                    "focus",
                    () => {
                        activateZone(
                            zone
                        );
                    }
                );


                if (canHover) {
                    zone.addEventListener(
                        "pointerenter",
                        () => {
                            activateZone(
                                zone
                            );
                        }
                    );
                }
            }
        );
    }




    function initAccessSplit() {
        const slider =
            $(".access-split__slider");

        if (
            !slider ||
            typeof window.Swiper ===
                "undefined"
        ) {
            return;
        }


        const frame =
            slider.closest(
                ".access-split__frame"
            );

        const pagination =
            $(
                ".access-split__pagination",
                frame
            );


        new window.Swiper(
            slider,
            {
                direction:
                    "vertical",

                loop:
                    false,

                rewind:
                    true,

                slidesPerView:
                    1,

                spaceBetween:
                    0,

                speed:
                    prefersReducedMotion
                        ? 0
                        : 900,

                observer:
                    false,

                observeParents:
                    false,

                resizeObserver:
                    true,

                allowTouchMove:
                    !prefersReducedMotion,

                autoplay:
                    prefersReducedMotion
                        ? false
                        : {
                            delay:
                                4600,

                            disableOnInteraction:
                                false,

                            pauseOnMouseEnter:
                                true
                        },

                pagination: {
                    el:
                        pagination,

                    clickable:
                        true
                }
            }
        );
    }




    function initProtectionModes() {
        const container =
            $(".protection-modes__row");

        if (!container) {
            return;
        }


        const modes =
            $$(
                "[data-protection-mode]",
                container
            );


        if (!modes.length) {
            return;
        }


        function activate(
            target
        ) {
            modes.forEach(
                (mode) => {
                    mode.classList.toggle(
                        "is-active",
                        mode === target
                    );

                    mode.setAttribute(
                        "aria-expanded",
                        mode === target
                            ? "true"
                            : "false"
                    );
                }
            );
        }


        modes.forEach(
            (mode) => {
                mode.setAttribute(
                    "role",
                    "button"
                );


                mode.setAttribute(
                    "aria-expanded",
                    mode.classList.contains(
                        "is-active"
                    )
                        ? "true"
                        : "false"
                );


                mode.addEventListener(
                    "click",
                    () => {
                        activate(
                            mode
                        );
                    }
                );


                mode.addEventListener(
                    "keydown",
                    (event) => {
                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {
                            event.preventDefault();

                            activate(
                                mode
                            );

                            return;
                        }


                        const currentIndex =
                            modes.indexOf(
                                mode
                            );


                        if (
                            event.key ===
                            "ArrowRight"
                        ) {
                            event.preventDefault();

                            const next =
                                modes[
                                    (
                                        currentIndex +
                                        1
                                    ) %
                                    modes.length
                                ];


                            activate(
                                next
                            );

                            next.focus();
                        }


                        if (
                            event.key ===
                            "ArrowLeft"
                        ) {
                            event.preventDefault();

                            const previous =
                                modes[
                                    (
                                        currentIndex -
                                        1 +
                                        modes.length
                                    ) %
                                    modes.length
                                ];


                            activate(
                                previous
                            );

                            previous.focus();
                        }
                    }
                );


                if (canHover) {
                    mode.addEventListener(
                        "pointerenter",
                        () => {
                            activate(
                                mode
                            );
                        }
                    );
                }
            }
        );
    }




    function initEditorialReviews() {
        const slider =
            $(".editorial-reviews__slider");

        if (
            !slider ||
            typeof window.Swiper ===
                "undefined"
        ) {
            return;
        }


        const section =
            slider.closest(
                ".editorial-reviews"
            );


        const clientButtons =
            $$(
                "[data-review-index]",
                section
            );


        const swiper =
            new window.Swiper(
                slider,
                {
                    loop:
                        true,

                    slidesPerView:
                        1,

                    spaceBetween:
                        28,

                    speed:
                        prefersReducedMotion
                            ? 0
                            : 760,

                    allowTouchMove:
                        true,

                    grabCursor:
                        true,

                    autoHeight:
                        false,

                    autoplay:
                        prefersReducedMotion
                            ? false
                            : {
                                delay:
                                    5600,

                                disableOnInteraction:
                                    false,

                                pauseOnMouseEnter:
                                    true
                            },

                    on: {
                        init(instance) {
                            updateReviewNavigation(
                                instance.realIndex
                            );
                        },

                        realIndexChange(instance) {
                            updateReviewNavigation(
                                instance.realIndex
                            );
                        }
                    }
                }
            );


        function updateReviewNavigation(
            index
        ) {
            clientButtons.forEach(
                (
                    button,
                    buttonIndex
                ) => {
                    button.classList.toggle(
                        "is-active",
                        buttonIndex ===
                            index
                    );
                }
            );
        }


        clientButtons.forEach(
            (
                button,
                index
            ) => {
                button.addEventListener(
                    "click",
                    () => {
                        if (
                            typeof swiper.slideToLoop ===
                            "function"
                        ) {
                            swiper.slideToLoop(
                                index
                            );
                        } else {
                            swiper.slideTo(
                                index
                            );
                        }
                    }
                );
            }
        );


        return swiper;
    }




    function initVisualFAQ() {
        const accordion =
            $("#home-security-faq");

        if (!accordion) {
            return;
        }


        const images =
            $$(
                "[data-faq-image]"
            );


        if (!images.length) {
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
                                .faqImage
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
                        .faqIndex;


                if (
                    index ===
                    undefined
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
                    item.dataset.faqIndex;


                button?.addEventListener(
                    "focus",
                    () => {
                        activateImage(
                            index
                        );
                    }
                );
            }
        );
    }




    function initContactServiceSelector() {
        const form =
            $(
                ".contact-console [data-contact-form]"
            );

        if (!form) {
            return;
        }


        const buttons =
            $$(
                "[data-contact-service]",
                form
            );

        const hiddenInput =
            $(
                "[data-contact-service-input]",
                form
            );


        if (
            !buttons.length ||
            !hiddenInput
        ) {
            return;
        }


        function activate(
            target
        ) {
            buttons.forEach(
                (button) => {
                    button.classList.toggle(
                        "is-active",
                        button === target
                    );
                }
            );


            hiddenInput.value =
                target.dataset
                    .contactService ||
                "";
        }


        buttons.forEach(
            (button) => {
                button.addEventListener(
                    "click",
                    () => {
                        activate(
                            button
                        );
                    }
                );
            }
        );
    }




    function initTrustMetrics() {
        const section =
            $(".trust-metrics");

        if (!section) {
            return;
        }


        const tabs =
            $$(
                "[data-tab-trigger]",
                section
            );

        const panes =
            $$(
                "[data-tab-panel]",
                section
            );


        if (tabs.length) {
            tabs.forEach(
                (tab) => {
                    tab.addEventListener(
                        "click",
                        () => {
                            const target =
                                tab.dataset
                                    .tabTrigger;

                            if (
                                tab.classList.contains(
                                    "is-active"
                                )
                            ) {
                                return;
                            }


                            tabs.forEach(
                                (item) => {
                                    const isMatch =
                                        item ===
                                        tab;

                                    item.classList.toggle(
                                        "is-active",
                                        isMatch
                                    );

                                    item.setAttribute(
                                        "aria-selected",
                                        isMatch ?
                                            "true" :
                                            "false"
                                    );
                                }
                            );


                            panes.forEach(
                                (pane) => {
                                    const isMatch =
                                        pane.dataset
                                            .tabPanel ===
                                        target;

                                    pane.classList.toggle(
                                        "is-active",
                                        isMatch
                                    );

                                    pane.hidden =
                                        !isMatch;
                                }
                            );
                        }
                    );
                }
            );
        }


        const counters =
            $$(
                "[data-count-target]",
                section
            );

        if (!counters.length) {
            return;
        }


        let hasCounted =
            false;

        function runCounters() {
            if (hasCounted) {
                return;
            }

            hasCounted =
                true;


            counters.forEach(
                (counter) => {
                    const target =
                        parseInt(
                            counter.dataset
                                .countTarget,
                            10
                        ) || 0;

                    const suffix =
                        counter.dataset
                            .countSuffix ||
                        "";


                    if (prefersReducedMotion) {
                        counter.textContent =
                            `${target}${suffix}`;

                        return;
                    }


                    const duration =
                        1400;

                    const startTime =
                        performance.now();

                    function tick(
                        now
                    ) {
                        const progress =
                            clamp(
                                (now - startTime) /
                                    duration,
                                0,
                                1
                            );

                        const eased =
                            1 -
                            Math.pow(
                                1 - progress,
                                3
                            );

                        const value =
                            Math.round(
                                eased * target
                            );

                        counter.textContent =
                            `${value}${suffix}`;


                        if (progress < 1) {
                            window.requestAnimationFrame(
                                tick
                            );
                        }
                    }

                    window.requestAnimationFrame(
                        tick
                    );
                }
            );
        }


        if (
            !("IntersectionObserver" in window)
        ) {
            runCounters();

            return;
        }


        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(
                        (entry) => {
                            if (entry.isIntersecting) {
                                runCounters();

                                observer.disconnect();
                            }
                        }
                    );
                },
                {
                    threshold:
                        0.35
                }
            );

        counterObserver.observe(
            $(".trust-metrics__stats", section)
        );
    }




    function initPhotoParallax() {
        if (
            prefersReducedMotion ||
            window.innerWidth < 768
        ) {
            return;
        }


        const images =
            [
                $(".trust-editorial__main-photo"),
                $(".camera-wall__cell--large .camera-wall__image"),
                $(".trust-metrics__bg-photo")
            ].filter(Boolean);


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
                            relative * 8,
                            -4,
                            4
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




    function initCameraWall() {
        const wall =
            $(".camera-wall__grid");

        if (!wall) {
            return;
        }


        const cells =
            $$(
                ".camera-wall__cell",
                wall
            );


        if (!cells.length) {
            return;
        }


        if (!canHover) {
            return;
        }


        cells.forEach(
            (cell) => {
                cell.addEventListener(
                    "pointerenter",
                    () => {
                        cells.forEach(
                            (otherCell) => {
                                otherCell.style.opacity =
                                    otherCell ===
                                        cell
                                        ? "1"
                                        : "0.78";
                            }
                        );
                    }
                );
            }
        );


        wall.addEventListener(
            "pointerleave",
            () => {
                cells.forEach(
                    (cell) => {
                        cell.style.opacity =
                            "";
                    }
                );
            }
        );
    }




    function initSectionVisibility() {
        const sections =
            $$(
                "main > section"
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


    function init() {
        initHero();

        initSecurityScenarios();

        initProtectionMap();

        initAccessSplit();

        initProtectionModes();

        initEditorialReviews();

        initVisualFAQ();

        initContactServiceSelector();

        initTrustMetrics();

        initPhotoParallax();

        initCameraWall();

        initSectionVisibility();
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

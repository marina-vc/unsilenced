// ============================================================
// animation.js — GSAP animations
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(SplitText);

    const introEl = document.getElementById("intro");
    const introDescriptionEl = document.getElementById("intro-description");
    const introSubtitle = introEl.querySelector(".intro__subtitle");
    const introScrollIndicator = introEl.querySelector(".intro__scroll-indicator span");
    const introFootnote = introEl.querySelector(".intro__subtitle--footnote");
    const paragraphs = introDescriptionEl.querySelectorAll(".intro-description__content p");

    gsap.set(introEl, { opacity: 1 });

    const allChars = Array.from(paragraphs);
    const bottom = introDescriptionEl.querySelector(".intro-description__bottom");

    let isGoingBack = false;

    gsap.set(allChars, { opacity: 0, filter: "blur(8px)", y: 4 });
    gsap.set(bottom, { opacity: 0 });


    // ============================================================
    // INTRO — Title entrance animation
    // ============================================================
    const subtitleLines = introSubtitle.innerHTML.split("<br>").map((line, i) => {
        const span = document.createElement("span");
        span.style.display = "block";
        span.innerHTML = line;
        gsap.set(span, { y: 20 * (i + 1), opacity: 0 });
        return span;
    });

    introSubtitle.innerHTML = "";
    subtitleLines.forEach(span => introSubtitle.appendChild(span));

    gsap.set(introFootnote, { opacity: 0 });
    gsap.set(introScrollIndicator, { opacity: 0 });

    gsap.to(subtitleLines, {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        stagger: { each: 0.15 },
        delay: 0.2,
        onComplete: () => {
            gsap.to(introFootnote, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(introScrollIndicator, {
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                }
            });
        }
    });


    // ============================================================
    // INTRO → INTRO DESCRIPTION — Forward timeline
    // ============================================================
    const tlIntro = gsap.timeline({ paused: true });

    tlIntro
        .to(introEl, { opacity: 0, duration: 0.5, ease: "power2.out" })
        .set(introEl, { display: "none" })
        .set(introDescriptionEl, { display: "flex" })
        .to(allChars, {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1,
            ease: "power2.out",
            stagger: { each: 0.35, ease: "power1.inOut" }
        }, "-=0.1")
        .to(bottom, { opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.4 });

    tlIntro.eventCallback("onComplete", () => {
        document.dispatchEvent(new CustomEvent("introComplete"));
    });


    // ============================================================
    // INTRO DESCRIPTION → INTRO — Reverse timeline
    // ============================================================
    const tlBack = gsap.timeline({ paused: true });

    tlBack
        .set(introDescriptionEl, { display: "none" })
        .set(introEl, { display: "flex", opacity: 0 })
        .set(introSubtitle, { y: 15, opacity: 0 })
        .set(introScrollIndicator, { y: 10, opacity: 0 })
        .set(introFootnote, { y: 15, opacity: 0 })
        .to(introEl, { opacity: 1, duration: 0.7, ease: "power1.inOut" })
        .to(introSubtitle, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.4")
        .to(introFootnote, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.6")
        .to(introScrollIndicator, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.5");

    tlBack.eventCallback("onComplete", () => {
        isGoingBack = false;
        gsap.set(allChars, { opacity: 0, filter: "blur(8px)", y: 4 });
        gsap.set(bottom, { opacity: 0 });
        tlIntro.progress(0).pause();
    });


    // ============================================================
    // SCROLL — Wheel events
    // ============================================================
    let triggered = false;
    let scrollAccumDown = 0;
    let scrollAccumUp = 0;
    const THRESHOLD = 300;

    // Intro — scroll down
    introEl.addEventListener("wheel", (e) => {
        if (triggered) return;
        if (e.deltaY > 0) {
            scrollAccumDown = Math.min(scrollAccumDown + e.deltaY, THRESHOLD);
            const progress = scrollAccumDown / THRESHOLD;
            gsap.set(introSubtitle, { y: -(progress * 15), opacity: 1 - progress * 0.4 });
            gsap.set(introScrollIndicator, { y: -(progress * 10), opacity: 1 - progress * 0.5 });
            gsap.set(introFootnote, { y: -(progress * 15), opacity: 1 - progress * 0.4 });
            if (scrollAccumDown >= THRESHOLD) {
                triggered = true;
                gsap.set(introSubtitle, { y: 0, opacity: 1 });
                gsap.set(introScrollIndicator, { y: 0, opacity: 1 });
                gsap.set(introFootnote, { y: 0, opacity: 1 });
                tlBack.progress(0).pause();
                tlIntro.restart();
            }
        } else {
            scrollAccumDown = Math.max(0, scrollAccumDown - Math.abs(e.deltaY));
            const progress = scrollAccumDown / THRESHOLD;
            gsap.set(introSubtitle, { y: -(progress * 15), opacity: 1 - progress * 0.4 });
            gsap.set(introScrollIndicator, { y: -(progress * 10), opacity: 1 - progress * 0.5 });
            gsap.set(introFootnote, { y: -(progress * 15), opacity: 1 - progress * 0.4 });
        }
    });

    // Intro description — scroll up
    introDescriptionEl.addEventListener("wheel", (e) => {
        if (e.deltaY < 0) {
            scrollAccumUp += Math.abs(e.deltaY);
            const progress = Math.min(scrollAccumUp / THRESHOLD, 1);
            gsap.set(allChars, { opacity: 1 - progress * 0.4, filter: `blur(${progress * 4}px)` });
            gsap.set(bottom, { opacity: 1 - progress * 0.6 });

            if (scrollAccumUp > THRESHOLD) {
                scrollAccumUp = 0;
                triggered = false;
                scrollAccumDown = 0;
                gsap.to(allChars, { opacity: 0, filter: "blur(8px)", duration: 0.4, ease: "power1.inOut" });
                gsap.to(bottom, { opacity: 0, duration: 0.3, ease: "power1.inOut", onComplete: () => {
                    if (isGoingBack) return;
                    isGoingBack = true;
                    tlIntro.progress(0).pause();
                    gsap.set(allChars, { opacity: 0, filter: "blur(8px)", y: 4 });
                    gsap.set(bottom, { opacity: 0 });
                    tlBack.restart();
                }});
            }
        } else {
            scrollAccumUp = Math.max(0, scrollAccumUp - Math.abs(e.deltaY));
            const progress = Math.min(scrollAccumUp / THRESHOLD, 1);
            gsap.set(allChars, { opacity: 1 - progress * 0.4, filter: `blur(${progress * 4}px)` });
            gsap.set(bottom, { opacity: 1 - progress * 0.6 });
        }
    });


    // ============================================================
    // TOUCH — Touch events
    // ============================================================

    // Intro — swipe down
    let touchStartY = 0;
    introEl.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    });

    introEl.addEventListener("touchmove", (e) => {
        if (triggered) return;
        const delta = touchStartY - e.touches[0].clientY;
        if (delta > 0) {
            const progress = Math.min(delta / 400, 1);
            gsap.set(introSubtitle, { y: -(progress * 15), opacity: 1 - progress * 0.4 });
            gsap.set(introScrollIndicator, { y: -(progress * 10), opacity: 1 - progress * 0.5 });
            gsap.set(introFootnote, { y: -(progress * 15), opacity: 1 - progress * 0.4 });
        }
    });

    introEl.addEventListener("touchend", (e) => {
        if (triggered) return;
        const delta = touchStartY - e.changedTouches[0].clientY;
        if (delta > 250) {
            triggered = true;
            gsap.set(introSubtitle, { y: 0, opacity: 1 });
            gsap.set(introScrollIndicator, { y: 0, opacity: 1 });
            gsap.set(introFootnote, { y: 0, opacity: 1 });
            tlBack.progress(0).pause();
            tlIntro.restart();
        } else {
            gsap.to(introSubtitle, { y: 0, opacity: 1, duration: 0.3 });
            gsap.to(introScrollIndicator, { y: 0, opacity: 1, duration: 0.3 });
            gsap.to(introFootnote, { y: 0, opacity: 1, duration: 0.3 });
            scrollAccumDown = 0;
        }
    });

    // Intro description — swipe up
    let touchStartYDesc = 0;
    introDescriptionEl.addEventListener("touchstart", (e) => {
        touchStartYDesc = e.touches[0].clientY;
    });

    introDescriptionEl.addEventListener("touchmove", (e) => {
        const delta = e.touches[0].clientY - touchStartYDesc;
        if (delta > 0) {
            const progress = Math.min(delta / 400, 1);
            gsap.set(allChars, { opacity: 1 - progress * 0.4, filter: `blur(${progress * 4}px)` });
            gsap.set(bottom, { opacity: 1 - progress * 0.6 });
        }
    });

    introDescriptionEl.addEventListener("touchend", (e) => {
        const delta = e.changedTouches[0].clientY - touchStartYDesc;
        if (delta > 250) {
            triggered = false;
            scrollAccumDown = 0;
            gsap.to(allChars, { opacity: 0, filter: "blur(8px)", duration: 0.4, ease: "power1.inOut" });
            gsap.to(bottom, { opacity: 0, duration: 0.3, ease: "power1.inOut", onComplete: () => {
                if (isGoingBack) return;
                isGoingBack = true;
                tlIntro.progress(0).pause();
                gsap.set(allChars, { opacity: 0, filter: "blur(8px)", y: 4 });
                gsap.set(bottom, { opacity: 0 });
                tlBack.restart();
            }});
        } else {
            gsap.to(allChars, { opacity: 1, filter: "blur(0px)", duration: 0.3 });
            gsap.to(bottom, { opacity: 1, duration: 0.3 });
            scrollAccumUp = 0;
        }
    });


    // ============================================================
    // CASE QUESTION — Full parallax entrance (btn-case-01, footer next)
    // ============================================================
    const animateCaseQuestion = (questionEl) => {
        if (questionEl._resetTransition) questionEl._resetTransition();
        const headerParagraphs = questionEl.querySelectorAll(".case__header p, .case__header span");
        const options = questionEl.querySelectorAll(".case__option");
        const optionsWrapper = questionEl.querySelector(".case__options");
        const gradient = questionEl.querySelector(".case__scroll-indicator");

        // Reset gradient
        if (gradient) gsap.set(gradient, { height: "30vh", backgroundColor: "" });

        gsap.set(headerParagraphs, { opacity: 0, y: 20 });
        gsap.set(optionsWrapper, { opacity: 0 });
        gsap.set(options, { opacity: 0, y: 30 });

        gsap.to(headerParagraphs, {
            opacity: 1, y: 0, duration: 2, ease: "power2.out",
            stagger: { each: 0.2 }, delay: 0.1
        });
        gsap.to(optionsWrapper, { opacity: 1, duration: 1, ease: "power2.out", delay: 1.2 });
        gsap.to(options, {
            opacity: 1, y: 0, duration: 2, ease: "power2.out",
            stagger: { each: 0.15 }, delay: 1.2
        });
    };

    // ============================================================
    // CASE QUESTION — Simple fade (menu, back button)
    // ============================================================
    const fadeCaseQuestion = (questionEl) => {
        if (questionEl._resetTransition) questionEl._resetTransition();
        const gradient = questionEl.querySelector(".case__scroll-indicator");

        // Reset gradient
        if (gradient) gsap.set(gradient, { height: "30vh", backgroundColor: "" });

        gsap.fromTo(questionEl,
            { opacity: 0, filter: "blur(8px)" },
            { opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
        );
    };


    // ============================================================
    // CASE QUESTION → CASE DATA — Scroll transition
    // ============================================================
    const initCaseTransition = (questionEl, dataEl, onComplete) => {
        const header = questionEl.querySelector(".case__header");
        const options = questionEl.querySelector(".case__options");
        const gradient = questionEl.querySelector(".case__scroll-indicator");

        const THRESHOLD = 300;
        let accumDown = 0;
        let touchStartY = 0;
        let triggered = false;

        // Reset expuesto para que fadeCaseQuestion/animateCaseQuestion lo llamen
        questionEl._resetTransition = () => {
            triggered = false;
            accumDown = 0;
            gsap.set(header, { y: 0 });
            gsap.set(options, { y: 0 });
            if (gradient) gsap.set(gradient, { height: "30vh", backgroundColor: "" });
        };

        const applyProgress = (progress) => {
            gsap.set(header, { y: -(progress * 30) });
            gsap.set(options, { y: -(progress * 20) });
        };

        const triggerTransition = () => {
            triggered = true;

            // Phase 1 — gradient expands to cover screen
            gsap.to(gradient, {
                height: "100dvh",
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {

                    // Phase 2 — fade to full black
                    gsap.to(gradient, {
                        backgroundColor: "var(--color-black)",
                        duration: 0.3,
                        ease: "power1.inOut",
                        onComplete: () => {
                            onComplete();

                            // Phase 3 — fade in text, then photo
                            const dataHeader = dataEl.querySelector(".case__data-header");
                            const dataScroll = dataEl.querySelector(".case__data-scroll");
                            const dataImg = dataEl.querySelector("img");

                            gsap.set(dataHeader, { opacity: 0, y: 10 });
                            gsap.set(dataScroll, { opacity: 0 });
                            gsap.set(dataImg, { opacity: 0 });

                            gsap.to(dataHeader, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 });
                            gsap.to(dataScroll, { opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.4 });
                            gsap.to(dataImg, { opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.6 });
                        }
                    });
                }
            });
        };

        const resetProgress = () => {
            gsap.to(header, { y: 0, duration: 0.3, ease: "power2.out" });
            gsap.to(options, { y: 0, duration: 0.3, ease: "power2.out" });
            accumDown = 0;
        };

        // Wheel
        questionEl.addEventListener("wheel", (e) => {
            if (triggered) return;
            if (e.deltaY > 0) {
                accumDown = Math.min(accumDown + e.deltaY, THRESHOLD);
                applyProgress(accumDown / THRESHOLD);
                if (accumDown >= THRESHOLD) triggerTransition();
            } else {
                accumDown = Math.max(0, accumDown - Math.abs(e.deltaY));
                applyProgress(accumDown / THRESHOLD);
                if (accumDown === 0) resetProgress();
            }
        });

        // Touch
        questionEl.addEventListener("touchstart", (e) => {
            touchStartY = e.touches[0].clientY;
        });

        questionEl.addEventListener("touchmove", (e) => {
            if (triggered) return;
            const delta = touchStartY - e.touches[0].clientY;
            if (delta > 0) {
                const progress = Math.min(delta / 300, 1);
                applyProgress(progress);
            }
        });

        questionEl.addEventListener("touchend", (e) => {
            if (triggered) return;
            const delta = touchStartY - e.changedTouches[0].clientY;
            if (delta > 200) {
                triggerTransition();
            } else {
                resetProgress();
            }
        });
    };


    window.initCaseTransition = initCaseTransition;

    window.animateCaseQuestion = animateCaseQuestion;
    window.fadeCaseQuestion = fadeCaseQuestion;

});
// ============================================================
// main.js — Core logic: navigation, voting, etc
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const show = (el) => { el.style.display = "flex"; }
    const hide = (el) => { el.style.display = "none"; }

    let currentScreen = document.getElementById("intro");
    let isTransitioning = false;

    const goTo = (next) => {
        if (isTransitioning) return;
        isTransitioning = true;
        hide(currentScreen);
        show(next);
        currentScreen = next;
        setTimeout(() => { isTransitioning = false; }, 600);
    };

    // ============================================================
    // NAVIGATION — intro-description > case-01
    // ============================================================
    const introDescriptionEl = document.getElementById("intro-description");
    document.addEventListener("introComplete", () => {
        currentScreen = introDescriptionEl;
        isTransitioning = false;
    });

    const btnCase01 = document.getElementById("btn-case-01");
    btnCase01.addEventListener("click", () => {
        if (currentScreen !== introDescriptionEl) return;
        const case01 = document.getElementById("case-01");
        const questionEl = case01.querySelector(".case__question");
        hide(currentScreen);
        case01.style.display = "block";
        questionEl.style.display = "flex";
        window.animateCaseQuestion(questionEl); // ← full parallax
        currentScreen = questionEl;
        isTransitioning = false;
    });


    // ============================================================
    // VOTING
    // ============================================================

    document.querySelectorAll(".case__option").forEach(option => {
        option.addEventListener("click", (e) => {
            const optionEl = e.currentTarget;
            const optionsEl = optionEl.closest(".case__options");
            const votedValue = optionEl.dataset.value;
            const percentages = {
                loved: 10, watched: 90,
                exposed: 75, popular: 25,
                small: 80, smart: 20,
                fully: 30, hopeso: 70
            };

            optionsEl.querySelectorAll(".case__option").forEach(opt => {
                const value = opt.dataset.value;
                const pct = percentages[value] || 50;
                const percentEl = opt.querySelector(".case__result-percent");

                gsap.to(opt, {
                    flex: pct / 10,
                    duration: 1.2,
                    ease: "expo.inOut",
                    onComplete: () => {
                        if (percentEl) {
                            percentEl.textContent = pct + "%";
                            gsap.fromTo(percentEl,
                                { opacity: 0, display: "block" },
                                { opacity: 1, duration: 0.4, ease: "power2.out",
                                  onComplete: () => {
                                      const scrollIndicator = optionsEl.closest(".case__question").querySelector(".case__scroll-indicator");
                                      if (scrollIndicator) {
                                          scrollIndicator.classList.remove("hidden");
                                          setTimeout(() => { scrollIndicator.classList.add("visible"); }, 50);
                                      }
                                  }
                                }
                            );
                        }
                    }
                });

                if (value === votedValue) opt.classList.add("selected");
            });
        });
    });

    // ============================================================
    // NAVIGATION — case__question > case__data (scroll/swipe)
    // ============================================================

    document.querySelectorAll(".case__question").forEach(questionEl => {
        const caseEl = questionEl.closest(".case");
        const caseId = caseEl.id.replace("case-", "");
        const dataEl = document.querySelector(`.case__data[data-case="${caseId.padStart(2, '0')}"]`);

        window.initCaseTransition(questionEl, dataEl, () => {
            hide(questionEl);
            caseEl.style.display = "none";
            show(dataEl);
            showFooter(caseId.padStart(2, '0'));
            currentScreen = dataEl;
        });
    });

    // ============================================================
    // PLAY BUTTON — case__data > case__data-visual
    // ============================================================

    document.querySelectorAll(".btn--play").forEach(btn => {
        btn.addEventListener("click", () => {
            const caseId = btn.dataset.case;
            const stat = btn.dataset.stat;
            const dataEl = document.querySelector(`.case__data[data-case="${caseId}"]`);

            dataEl.querySelector(".case__data-scroll").style.display = "none";
            dataEl.querySelector(".gradient--blur").style.display = "none";
            footerNext.style.display = "none";

            const visualEl = dataEl.querySelector(`.case__data-visual[data-stat="${stat}"]`);
            visualEl.classList.remove("hidden");
            visualEl.classList.add("visible");

            // Fade in visual
            gsap.fromTo(visualEl,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        });
    });

    // ============================================================
    // GLOBAL FOOTER
    // ============================================================

    const caseFooter = document.getElementById("case-footer");
    const footerBack = document.getElementById("footer-back");
    const footerNext = document.getElementById("footer-next");
    let currentCaseId = null;

    const showFooter = (caseId) => {
        currentCaseId = caseId;
        caseFooter.style.display = "flex";
        if (caseId === "04") {
            footerNext.innerHTML = `NEXT <svg width="21" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.50293 0.707031L19.1651 11.3694L8.50293 22.0316" stroke="black" stroke-width="2"/><path d="M0.000235891 11.0999L19.435 11.1002" stroke="black" stroke-width="2"/></svg>`;
        } else {
            footerNext.innerHTML = `Next case <svg width="21" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.50293 0.707031L19.1651 11.3694L8.50293 22.0316" stroke="black" stroke-width="2"/><path d="M0.000235891 11.0999L19.435 11.1002" stroke="black" stroke-width="2"/></svg>`;
        }
        footerNext.style.display = "flex";
    };

    const hideFooter = () => {
        caseFooter.style.display = "none";
        currentCaseId = null;
    };

    footerBack.addEventListener("click", () => {
        if (!currentCaseId) return;
        const dataEl = document.querySelector(`.case__data[data-case="${currentCaseId}"]`);
        const openVisual = dataEl.querySelector(".case__data-visual.visible");

        if (openVisual) {
            openVisual.classList.remove("visible");
            openVisual.classList.add("hidden");
            dataEl.querySelector(".case__data-scroll").style.display = "block";
            dataEl.querySelector(".gradient--blur").style.display = "block";
            footerNext.style.display = "flex";
            return;
        }

        const caseEl = document.getElementById(`case-${currentCaseId}`);
        const questionEl = caseEl.querySelector(".case__question");
        hide(dataEl);
        hideFooter();
        caseEl.style.display = "block";
        show(questionEl);
        window.fadeCaseQuestion(questionEl); // ← simple fade
        currentScreen = questionEl;
    });

    footerNext.addEventListener("click", () => {
        if (!currentCaseId) return;
        const dataEl = document.querySelector(`.case__data[data-case="${currentCaseId}"]`);
        const nextId = String(parseInt(currentCaseId) + 1).padStart(2, '0');
        const nextCaseEl = document.getElementById(`case-${nextId}`);

        if (nextCaseEl) {
            hide(dataEl);
            hideFooter();
            nextCaseEl.style.display = "block";
            const questionEl = nextCaseEl.querySelector(".case__question");
            show(questionEl);
            window.animateCaseQuestion(questionEl); // ← full parallax
            currentScreen = questionEl;
        } else {
            hide(dataEl);
            hideFooter();
            const closingEl = document.getElementById("closing");
            const closing01 = document.getElementById("closing-01");
            const closing02 = document.getElementById("closing-02");

            closing01.style.display = "none";
            closing02.style.display = "none";
            const closingNext = document.getElementById("closing-next");
            closingNext.setAttribute("disabled", "");
            closingNext.style.opacity = "0.3";

            show(closingEl);
            closing01.style.display = "flex";
            currentScreen = closingEl;

            setTimeout(() => {
                closing01.style.display = "none";
                closing02.style.display = "flex";
                closingNext.removeAttribute("disabled");
                setTimeout(() => {
                    closingNext.style.opacity = "1";
                }, 50);
            }, 2000);
        }
    });


    // ============================================================
    // GLOBAL HEADER
    // ============================================================
    document.querySelector(".header__logo").addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".case, .case__data, #intro-description, #closing").forEach(el => {
            el.style.display = "none";
        });
        hideFooter();
        const introEl = document.getElementById("intro");
        introEl.style.display = "flex";
        currentScreen = introEl;
    });


    // ============================================================
    // CONTACT PAGE
    // ============================================================
    const showContactScreen = (hideId, showId) => {
        const hideEl = document.getElementById(hideId);
        const showEl = document.getElementById(showId);
        hideEl.style.display = "none";
        showEl.style.display = "flex";
    };

    document.querySelectorAll(".js-open-contact").forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            closeMenu();
            document.querySelectorAll(".case, .case__data, #intro, #intro-description, #closing, #menu-closing").forEach(el => {
                el.style.display = "none";
            });
            hideFooter();

            document.querySelectorAll(".contact__screen").forEach(screen => {
                screen.style.display = "none";
            });

            show(document.getElementById("contact"));
            document.getElementById("contact-01").style.display = "flex";
            currentScreen = document.getElementById("contact");
        });
    });

    document.getElementById("contact-back").addEventListener("click", () => {
        hide(document.getElementById("contact"));
        show(document.getElementById("menu-closing"));
        currentScreen = document.getElementById("menu-closing");
    });

    document.getElementById("contact-support").addEventListener("click", () => {
        showContactScreen("contact-01", "contact-support-screen");
    });

    document.getElementById("contact-support-back").addEventListener("click", () => {
        showContactScreen("contact-support-screen", "contact-01");
    });

    document.getElementById("contact-us").addEventListener("click", () => {
        showContactScreen("contact-01", "contact-form");
    });

    document.getElementById("contact-form-back").addEventListener("click", () => {
        showContactScreen("contact-form", "contact-01");
    });

    document.getElementById("contact-form-send").addEventListener("click", () => {
        const inputs = document.querySelectorAll("#contact-form .contact__input, #contact-form .contact__textarea");
        let allFilled = true;
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                input.classList.add("error");
                allFilled = false;
            } else {
                input.classList.remove("error");
            }
        });
        if (!allFilled) return;
        inputs.forEach(input => { input.value = ""; });
        showContactScreen("contact-form", "contact-sent");
    });

    document.querySelectorAll("#contact-form .contact__input, #contact-form .contact__textarea").forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("error");
        });
    });

    document.getElementById("contact-send-again").addEventListener("click", () => {
        showContactScreen("contact-sent", "contact-form");
    });

    document.getElementById("contact-sent-back").addEventListener("click", () => {
        showContactScreen("contact-sent", "contact-01");
    });

    document.getElementById("contact-search-input").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll(".contact__support-item").forEach(item => {
            const name = item.querySelector(".contact__support-name").textContent.toLowerCase();
            item.style.display = name.includes(query) ? "flex" : "none";
        });
    });


    // ============================================================
    // MENU
    // ============================================================
    const menuEl = document.getElementById("menu");
    const menuBtn = document.querySelector(".header__menu-btn");
    const menuClose = document.getElementById("menu-close");

    const menuItems = [
        menuEl.querySelector(".menu__header"),
        ...menuEl.querySelectorAll(".menu__case-link"),
        ...menuEl.querySelectorAll(".menu__footer-link")
    ];

    gsap.set(menuItems, { opacity: 0, y: 8 });

    const openMenu = () => {
        gsap.to(menuEl, { x: "0%", duration: 0.8, ease: "power2.out" });
        gsap.to(menuItems, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power1.inOut",
            stagger: { each: 0.1, ease: "power1.inOut" },
            delay: 0.3
        });
    };

    const closeMenu = () => {
        gsap.to(menuItems, { opacity: 0, y: 8, duration: 0.2, ease: "power2.in" });
        gsap.to(menuEl, { x: "100%", duration: 0.4, ease: "power2.in", delay: 0.1 });
    };

    document.querySelectorAll(".menu__case-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            closeMenu();

            document.querySelectorAll(".case, .case__data, #intro-description, #closing, #menu-closing, #contact").forEach(el => {
                el.style.display = "none";
            });
            hideFooter();

            const caseEl = document.getElementById(`case-${target}`);
            caseEl.style.display = "block";
            const questionEl = caseEl.querySelector(".case__question");
            show(questionEl);
            window.fadeCaseQuestion(questionEl); // ← simple fade
            currentScreen = questionEl;
        });
    });

    menuBtn.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);


    // ============================================================
    // MENU CLOSING
    // ============================================================
    document.getElementById("closing-next").addEventListener("click", () => {
        hide(document.getElementById("closing"));
        show(document.getElementById("menu-closing"));
        currentScreen = document.getElementById("menu-closing");
    });


});
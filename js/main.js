// ============================================================
// main.js — Core logic: navigation, voting
// ============================================================

document.addEventListener("DOMContentLoaded", () => {


    // ============================================================
    // SHOW / HIDE
    // ============================================================

    const show = (el) => { el.style.display = "flex"; }
    const hide = (el) => { el.style.display = "none"; }


    // ============================================================
    // ACTIVE SCREEN
    // ============================================================

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
    // NAVIGATION — intro → intro-description
    // ============================================================

    const introEl = document.getElementById("intro");
    const introDescriptionEl = document.getElementById("intro-description");

    introEl.addEventListener("wheel", (e) => {
        if (currentScreen !== introEl) return;
        if (e.deltaY > 0) goTo(introDescriptionEl);
    });

    let touchStartY = 0;
    introEl.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; });
    introEl.addEventListener("touchend", (e) => {
        if (currentScreen !== introEl) return;
        if (touchStartY - e.changedTouches[0].clientY > 50) goTo(introDescriptionEl);
    });


    // ============================================================
    // NAVIGATION — intro-description → case-01
    // ============================================================

    const btnCase01 = document.getElementById("btn-case-01");

    btnCase01.addEventListener("click", () => {
        if (currentScreen !== introDescriptionEl) return;

        const case01 = document.getElementById("case-01");
        const questionEl = case01.querySelector(".case__question");

        hide(currentScreen);
        case01.style.display = "block";
        questionEl.style.display = "flex";
        currentScreen = questionEl;
        isTransitioning = false;
    });


    // ============================================================
    // VOTING — deforms SVG based on vote percentage
    // ============================================================

    document.querySelectorAll(".case__option").forEach(option => {
        option.addEventListener("click", (e) => {

            const optionEl = e.currentTarget;
            const optionsEl = optionEl.closest(".case__options");
            const votedValue = optionEl.dataset.value;

            const percentages = { loved: 10, watched: 90 };

            optionsEl.querySelectorAll(".case__option").forEach(opt => {
                const value = opt.dataset.value;
                const pct = percentages[value] || 50;
                const percentEl = opt.querySelector(".case__result-percent");

                opt.style.flex = pct / 10;

                if (percentEl) {
                    percentEl.style.display = "block";
                    percentEl.textContent = pct + "%";
                }

                if (value === votedValue) {
                    opt.classList.add("selected");
                }
            });
        });
    });


    // ============================================================
    // NAVIGATION — case__question → case__data (scroll/swipe)
    // ============================================================

    document.querySelectorAll(".case__question").forEach(questionEl => {
        const caseEl = questionEl.closest(".case");
        const dataEl = caseEl.querySelector(".case__data");

        questionEl.addEventListener("wheel", (e) => {
            if (currentScreen !== questionEl) return;
            if (e.deltaY > 0) { hide(questionEl); show(dataEl); currentScreen = dataEl; }
        });

        let touchStartY = 0;
        questionEl.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; });
        questionEl.addEventListener("touchend", (e) => {
            if (currentScreen !== questionEl) return;
            if (touchStartY - e.changedTouches[0].clientY > 50) {
                hide(questionEl); show(dataEl); currentScreen = dataEl;
            }
        });
    });


    // ============================================================
    // EYE BUTTON — case__data → case__visual
    // ============================================================

    document.querySelectorAll(".case__eye-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const caseEl = btn.closest(".case");
            hide(caseEl.querySelector(".case__data"));
            show(caseEl.querySelector(".case__visual"));
            currentScreen = caseEl.querySelector(".case__visual");
        });
    });


    // ============================================================
    // CLOSE VISUAL — case__visual → case__data
    // ============================================================

    document.querySelectorAll(".case__visual-close").forEach(btn => {
        btn.addEventListener("click", () => {
            const caseEl = btn.closest(".case");
            hide(caseEl.querySelector(".case__visual"));
            show(caseEl.querySelector(".case__data"));
            currentScreen = caseEl.querySelector(".case__data");
        });
    });


});
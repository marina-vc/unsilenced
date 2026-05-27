// ============================================================
// main.js — Core logic: voting, fit-text, show/hide sections
// ============================================================

document.addEventListener("DOMContentLoaded", () => {


    // ============================================================
    // SHOW / HIDE
    // ============================================================

    const show = (el) => {
        el.style.display = "flex";
    }

    const hide = (el) => {
        el.style.display = "none";
    }


    // ============================================================
    // ACTIVE SCREEN
    // Only the active screen listens to scroll/swipe
    // ============================================================

    let currentScreen = document.getElementById("intro");
    let isTransitioning = false;

    const goTo = (next) => {
        if (isTransitioning) return;
        isTransitioning = true;

        hide(currentScreen);
        show(next);
        currentScreen = next;

        // Prevent double triggers
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    };


    // ============================================================
    // FIT-TEXT
    // ============================================================

    const fitText = (el) => {
        const container = el.parentElement;
        const containerWidth = container.offsetWidth - 32;

        let fontSize = 10;
        el.style.fontSize = fontSize + "px";
        el.style.whiteSpace = "nowrap";

        while (el.scrollWidth < containerWidth && fontSize < 500) {
            fontSize++;
            el.style.fontSize = fontSize + "px";
        }

        el.style.fontSize = (fontSize - 1) + "px";
    };

    const applyFitText = () => {
        document.querySelectorAll(".case__option, .case__result-label").forEach(el => {
            fitText(el);
        });
    };

    applyFitText();
    window.addEventListener("resize", applyFitText);


    // ============================================================
    // NAVIGATION — intro → intro-description (scroll/swipe only)
    // ============================================================

    const introEl = document.getElementById("intro");
    const introDescriptionEl = document.getElementById("intro-description");

    // Desktop scroll
    introEl.addEventListener("wheel", (e) => {
        if (currentScreen !== introEl) return;
        if (e.deltaY > 0) goTo(introDescriptionEl);
    });

    // Mobile swipe
    let touchStartY = 0;

    introEl.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    });

    introEl.addEventListener("touchend", (e) => {
        if (currentScreen !== introEl) return;
        const touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 50) goTo(introDescriptionEl);
    });


    // ============================================================
    // NAVIGATION — intro-description → case-01 (click button only)
    // ============================================================

    const btnCase01 = document.getElementById("btn-case-01");
    const case01 = document.getElementById("case-01");

    btnCase01.addEventListener("click", () => {
        if (currentScreen !== introDescriptionEl) return;
        goTo(case01);
    });


    // ============================================================
    // VOTING — case__question → case__answer
    // ============================================================

    document.querySelectorAll(".case__option").forEach(option => {
        option.addEventListener("click", (e) => {

            const caseEl = e.target.closest(".case");
            const questionEl = caseEl.querySelector(".case__question");
            const answerEl = caseEl.querySelector(".case__answer");
            const votedValue = e.target.dataset.value;

            // Placeholder percentages
            const percentages = {
                loved: 24,
                watched: 76
            };

            // Update results
            const results = answerEl.querySelectorAll(".case__result");
            results.forEach(result => {
                const label = result.querySelector(".case__result-label");
                const percent = result.querySelector(".case__result-percent");
                const value = label.textContent.toLowerCase().replace("feeling ", "");
                const pct = percentages[value] || 50;

                percent.textContent = pct + "%";
                result.style.flex = pct / 10;

                if (value === votedValue) {
                    result.classList.add("selected");
                }
            });

            // Reapply fit-text to result labels
            answerEl.querySelectorAll(".case__result-label").forEach(el => {
                fitText(el);
            });

            // Show answer, hide question
            hide(questionEl);
            show(answerEl);
        });
    });


    // ============================================================
    // NAVIGATION — case__answer → case__data (scroll/swipe)
    // ============================================================

    document.querySelectorAll(".case__answer").forEach(answerEl => {
        const caseEl = answerEl.closest(".case");
        const dataEl = caseEl.querySelector(".case__data");

        answerEl.addEventListener("wheel", (e) => {
            if (e.deltaY > 0) {
                hide(answerEl);
                show(dataEl);
            }
        });

        let touchStartY = 0;
        answerEl.addEventListener("touchstart", (e) => {
            touchStartY = e.touches[0].clientY;
        });

        answerEl.addEventListener("touchend", (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            if (touchStartY - touchEndY > 50) {
                hide(answerEl);
                show(dataEl);
            }
        });
    });


    // ============================================================
    // EYE BUTTON — case__data → case__visual
    // ============================================================

    document.querySelectorAll(".case__eye-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const caseEl = btn.closest(".case");
            const dataEl = caseEl.querySelector(".case__data");
            const visualEl = caseEl.querySelector(".case__visual");

            hide(dataEl);
            show(visualEl);
        });
    });


    // ============================================================
    // CLOSE VISUAL — case__visual → case__data
    // ============================================================

    document.querySelectorAll(".case__visual-close").forEach(btn => {
        btn.addEventListener("click", () => {
            const caseEl = btn.closest(".case");
            const dataEl = caseEl.querySelector(".case__data");
            const visualEl = caseEl.querySelector(".case__visual");

            hide(visualEl);
            show(dataEl);
        });
    });


});
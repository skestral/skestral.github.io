(() => {
    "use strict";

    const CHECKMARK_IMG = "img/checkmark.png";
    const XMARK_IMG = "img/xmark.png";
    const TOTAL_QUESTIONS = 10;
    const POINTS_PER_QUESTION = 10;

    let score = 0;
    let attempts = Number(localStorage.getItem("total_attempts")) || 0;

    const submitButton = document.getElementById("submitBtn");
    const resetButton = document.getElementById("resetBtn");
    const q4Choices = ["Maine", "Rhode Island", "Maryland", "Delaware"];

    displayQ4Choices(shuffleArray(q4Choices.slice()));
    updateAttemptsUI();

    if (submitButton) {
        submitButton.addEventListener("click", gradeQuiz);
    }

    if (resetButton) {
        resetButton.addEventListener("click", resetQuiz);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayQ4Choices(choices) {
        const choicesContainer = document.getElementById("q4Choices");
        if (!choicesContainer) {
            return;
        }

        choicesContainer.innerHTML = "";
        choices.forEach((choice) => {
            const id = `q4-${choice.replace(/\s+/g, "-").toLowerCase()}`;
            const label = document.createElement("label");
            label.setAttribute("for", id);
            label.innerHTML = `<input type="radio" name="q4" id="${id}" value="${choice}"> ${choice}`;
            choicesContainer.appendChild(label);
        });
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function setQuestionHighlight(index, isMissing) {
        const feedback = document.getElementById(`q${index}Feedback`);
        const questionBlock = feedback?.closest(".question-block");

        if (!questionBlock) {
            return;
        }

        questionBlock.classList.toggle("question-unanswered", isMissing);
    }

    function clearQuestionHighlights() {
        Array.from({ length: TOTAL_QUESTIONS }, (_, index) => index + 1).forEach((index) => {
            setQuestionHighlight(index, false);
        });
    }

    function isFormValid() {
        const validation = document.getElementById("validationFdbk");
        const missing = [];

        clearQuestionHighlights();

        if (!normalize(document.getElementById("q1")?.value)) missing.push(1);
        if (!(document.getElementById("q2")?.value || "")) missing.push(2);

        const q3Answered = ["Jackson", "Franklin", "Jefferson", "Roosevelt"].some(
            (id) => document.getElementById(id)?.checked
        );
        if (!q3Answered) missing.push(3);

        if (!document.querySelector("input[name='q4']:checked")) missing.push(4);
        if (!normalize(document.getElementById("q5")?.value)) missing.push(5);
        if (!normalize(document.getElementById("q6")?.value)) missing.push(6);
        if (!document.querySelector("input[name='q7']:checked")) missing.push(7);

        const q8Answered = ["q8-ca", "q8-az", "q8-nm", "q8-tx", "q8-nv"].some(
            (id) => document.getElementById(id)?.checked
        );
        if (!q8Answered) missing.push(8);

        if (!(document.getElementById("q9")?.value || "")) missing.push(9);
        if (!normalize(document.getElementById("q10")?.value)) missing.push(10);

        if (missing.length > 0) {
            missing.forEach((index) => setQuestionHighlight(index, true));
            if (validation) {
                validation.textContent = `Please answer: ${missing.map((index) => `Q${index}`).join(", ")}.`;
                validation.classList.remove("d-none");
            }
            return false;
        }

        if (validation) {
            validation.textContent = "";
            validation.classList.add("d-none");
        }

        clearQuestionHighlights();

        return true;
    }

    function rightAnswer(index) {
        const feedback = document.getElementById(`q${index}Feedback`);
        const mark = document.getElementById(`markImg${index}`);

        if (feedback) {
            feedback.textContent = "Correct!";
            feedback.className = "feedback-slot alert alert-success";
        }

        if (mark) {
            mark.innerHTML = `<img src="${CHECKMARK_IMG}" alt="Correct">`;
        }

        score += POINTS_PER_QUESTION;
    }

    function wrongAnswer(index) {
        const feedback = document.getElementById(`q${index}Feedback`);
        const mark = document.getElementById(`markImg${index}`);

        if (feedback) {
            feedback.textContent = "Incorrect!";
            feedback.className = "feedback-slot alert alert-warning";
        }

        if (mark) {
            mark.innerHTML = `<img src="${XMARK_IMG}" alt="Incorrect">`;
        }
    }

    function updateScoreUI() {
        const totalScore = document.getElementById("totalScore");
        const scoreMessage = document.getElementById("scoreMessage");

        if (totalScore) {
            totalScore.textContent = `Total Score: ${score} / 100`;
            totalScore.className = score < 80 ? "mt-4 text-center text-danger" : "mt-4 text-center text-success";
        }

        if (scoreMessage) {
            scoreMessage.textContent = score > 80
                ? "Congratulations! You scored above 80."
                : "Keep practicing and try again to improve your score.";
            scoreMessage.className = score > 80
                ? "text-center fw-semibold text-success"
                : "text-center fw-semibold text-danger";
        }
    }

    function updateAttemptsUI() {
        const totalAttempts = document.getElementById("totalAttempts");
        if (totalAttempts) {
            totalAttempts.textContent = `Total Attempts: ${attempts}`;
        }
    }

    function gradeQuiz() {
        if (!isFormValid()) {
            return;
        }

        score = 0;

        const q1Response = normalize(document.getElementById("q1")?.value);
        const q2Response = document.getElementById("q2")?.value || "";
        const q4Response = document.querySelector("input[name='q4']:checked")?.value || "";
        const q5Response = normalize(document.getElementById("q5")?.value).toUpperCase();
        const q6Response = Number(document.getElementById("q6")?.value);
        const q7Response = document.querySelector("input[name='q7']:checked")?.value || "";
        const q9Response = document.getElementById("q9")?.value || "";
        const q10Response = normalize(document.getElementById("q10")?.value);

        if (q1Response === "sacramento") rightAnswer(1); else wrongAnswer(1);
        if (q2Response === "mo") rightAnswer(2); else wrongAnswer(2);

        const jeffersonChecked = document.getElementById("Jefferson")?.checked;
        const rooseveltChecked = document.getElementById("Roosevelt")?.checked;
        const jacksonChecked = document.getElementById("Jackson")?.checked;
        const franklinChecked = document.getElementById("Franklin")?.checked;

        if (jeffersonChecked && rooseveltChecked && !jacksonChecked && !franklinChecked) {
            rightAnswer(3);
        } else {
            wrongAnswer(3);
        }

        if (q4Response === "Rhode Island") rightAnswer(4); else wrongAnswer(4);
        if (q5Response === "AK") rightAnswer(5); else wrongAnswer(5);
        if (q6Response === 5) rightAnswer(6); else wrongAnswer(6);
        if (q7Response === "Arizona") rightAnswer(7); else wrongAnswer(7);

        const q8CA = document.getElementById("q8-ca")?.checked;
        const q8AZ = document.getElementById("q8-az")?.checked;
        const q8NM = document.getElementById("q8-nm")?.checked;
        const q8TX = document.getElementById("q8-tx")?.checked;
        const q8NV = document.getElementById("q8-nv")?.checked;
        if (q8CA && q8AZ && q8NM && q8TX && !q8NV) rightAnswer(8); else wrongAnswer(8);

        if (q9Response === "Pacific") rightAnswer(9); else wrongAnswer(9);
        if (q10Response === "austin") rightAnswer(10); else wrongAnswer(10);

        attempts += 1;
        localStorage.setItem("total_attempts", String(attempts));

        updateScoreUI();
        updateAttemptsUI();
    }

    function resetQuiz() {
        const quizForm = document.getElementById("quizForm");
        const validation = document.getElementById("validationFdbk");
        const totalScore = document.getElementById("totalScore");
        const scoreMessage = document.getElementById("scoreMessage");

        score = 0;

        if (quizForm) {
            quizForm.reset();
        }

        clearQuestionHighlights();

        Array.from({ length: TOTAL_QUESTIONS }, (_, index) => index + 1).forEach((index) => {
            const feedback = document.getElementById(`q${index}Feedback`);
            const mark = document.getElementById(`markImg${index}`);

            if (feedback) {
                feedback.textContent = "";
                feedback.className = "feedback-slot";
            }

            if (mark) {
                mark.innerHTML = "";
            }
        });

        if (validation) {
            validation.textContent = "";
            validation.classList.add("d-none");
        }

        if (totalScore) {
            totalScore.textContent = "";
            totalScore.className = "mt-4 text-center";
        }

        if (scoreMessage) {
            scoreMessage.textContent = "";
            scoreMessage.className = "text-center fw-semibold";
        }

        displayQ4Choices(shuffleArray(q4Choices.slice()));
    }
})();
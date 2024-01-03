let Questions = [];
const ques = document.getElementById("ques");
let currQuestion = 0;
let score = 0;

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        Questions = data.results;
        if (Questions.length === 0) {
            ques.innerHTML = `<h5>No questions available</h5>`;
        } else {
            loadQues();
        }
    } catch (error) {
        console.error(error);
        ques.innerHTML = `<h5 style='color: red'>${error.message}</h5>`;
    }
}

// Rest of your code remains unchanged
function loadQues() {
    const opt = document.getElementById("opt");
    let currentQuestion = Questions[currQuestion].question;

    // Handle special characters
    currentQuestion = currentQuestion.replace(/&quot;/g, '\"');
    currentQuestion = currentQuestion.replace(/&#039;/g, '\'');

    ques.innerText = currentQuestion;
    opt.innerHTML = "";

    const correctAnswer = Questions[currQuestion].correct_answer;
    const incorrectAnswers = Questions[currQuestion].incorrect_answers;
    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5);

    options.forEach((option, index) => {
        // Handle special characters
        option = option.replace(/&quot;/g, '\"');
        option = option.replace(/&#039;/g, '\'');

        const choicesdiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");

        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;
        choice.id = "option" + index; // Assign unique IDs to each option for labels
        choiceLabel.setAttribute("for", "option" + index);
        choiceLabel.textContent = option;

        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });
}

setTimeout(() => {
    fetchQuestions();
}, 1000);

function loadScore() {
    const totalScore = document.getElementById("score");
    totalScore.innerHTML = `<h3>Your Score</h3>`;
    totalScore.innerHTML += `<p>You scored ${score} out of ${Questions.length}</p>`;
    totalScore.innerHTML += "<h3>All Answers</h3>";

    Questions.forEach((el, index) => {
        totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
    });
}

function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").innerHTML = "";
        document.getElementById("ques").innerHTML = "";
        document.getElementById("btn").innerHTML = "";
        loadScore();
    }
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');

    if (selectedAns) {
        const userAnswer = selectedAns.value;
        const correctAnswer = Questions[currQuestion].correct_answer;

        if (userAnswer === correctAnswer) {
            score++;
            alert("Correct!"); // Provide feedback for correct answer
        } else {
            alert(`Wrong! Correct answer: ${correctAnswer}`); // Provide feedback for wrong answer
        }

        nextQuestion();
    } else {
        alert("Please select an answer");
    }
}
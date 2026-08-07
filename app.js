let questions = [];
let currentQuestion = 0;
let score = 0;

const startBtn = document.getElementById("startBtn");
const reviewBtn = document.getElementById("reviewBtn");
const scoreBtn = document.getElementById("scoreBtn");

startBtn.onclick = startQuiz;

async function startQuiz() {
    try {
        const response = await fetch("data/kanji5.json");
        questions = await response.json();

        currentQuestion = 0;
        score = 0;

        showQuestion();

    } catch (error) {
        alert("問題データを読み込めませんでした。");
        console.error(error);
    }
}

function showQuestion() {

    const q = questions[currentQuestion];

    document.body.innerHTML = `
        <div class="container quiz">
            <p class="question-number">
                問題 ${currentQuestion + 1} / ${questions.length}
            </p>

            <h2>${q.sentence}</h2>

            <p class="question-text">
                「${q.question}」はどれ？
            </p>

            <div id="choices"></div>

            <p id="result"></p>
        </div>
    `;

    const choicesArea = document.getElementById("choices");

    q.choices.forEach(choice => {

        const button = document.createElement("button");

        button.textContent = choice;

        button.onclick = () => checkAnswer(choice);

        choicesArea.appendChild(button);
    });
}

function checkAnswer(choice) {

    const q = questions[currentQuestion];

    const result = document.getElementById("result");

    if (choice === q.answer) {

        score++;

        result.textContent = "🎉 せいかい！";

    } else {

        result.textContent =
            `💡 おしい！ 正解は「${q.answer}」だよ。`;
    }

    // 一度だけ答えられるようにする
    document.querySelectorAll("#choices button")
        .forEach(button => {
            button.disabled = true;
        });

    const nextButton = document.createElement("button");

    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "🏆 結果を見る"
            : "➡️ 次へ";

    nextButton.onclick = nextQuestion;

    document.querySelector(".quiz").appendChild(nextButton);
}

function nextQuestion() {

    currentQuestion++;

    if (currentQuestion >= questions.length) {

        showResult();

    } else {

        showQuestion();
    }
}

function showResult() {

    document.body.innerHTML = `
        <div class="container">

            <h1>🏆 結果</h1>

            <p class="result-score">
                ${questions.length}問中
                <strong>${score}問</strong> 正解！
            </p>

            <button onclick="location.reload()">
                🌳 もう一度やる
            </button>

        </div>
    `;
}

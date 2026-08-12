let questions = [];
let currentQuestion = 0;
let score = 0;

// 苦手な漢字を保存する
let weakKanji = JSON.parse(
    localStorage.getItem("weakKanji") || "[]"
);

const startBtn = document.getElementById("startBtn");
const reviewBtn = document.getElementById("reviewBtn");
const scoreBtn = document.getElementById("scoreBtn");

startBtn.onclick = startQuiz;

// 「にがてだけ」
reviewBtn.onclick = startWeakQuiz;

scoreBtn.onclick = showScore;


// ========================
// ふつうのクイズ
// ========================

async function startQuiz() {

    try {

        const response = await fetch("data/kanji5.json");

        questions = await response.json();

        if (questions.length === 0) {
            alert("問題がありません。");
            return;
        }

        currentQuestion = 0;
        score = 0;

        showQuestion();

    } catch (error) {

        alert("問題データを読み込めませんでした。");

        console.error(error);
    }
}


// ========================
// 苦手漢字だけのクイズ
// ========================

async function startWeakQuiz() {

    try {

        const response = await fetch("data/kanji5.json");

        const allQuestions = await response.json();

        questions = allQuestions.filter(q =>
            weakKanji.includes(q.answer)
        );

        if (questions.length === 0) {

            alert(
                "⭐ まだ苦手な漢字はありません。\n\n" +
                "まず「はじめる」で問題を解いてみよう！"
            );

            return;
        }

        currentQuestion = 0;
        score = 0;

        showQuestion();

    } catch (error) {

        alert("問題データを読み込めませんでした。");

        console.error(error);
    }
}


// ========================
// 問題を表示
// ========================

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

    const choicesArea =
        document.getElementById("choices");

    q.choices.forEach(choice => {

        const button =
            document.createElement("button");

        button.textContent = choice;

        button.onclick = () =>
            checkAnswer(choice);

        choicesArea.appendChild(button);
    });
}


// ========================
// 正解・不正解
// ========================

function checkAnswer(choice) {

    const q = questions[currentQuestion];

    const result =
        document.getElementById("result");

    if (choice === q.answer) {

        score++;

        result.textContent = "🎉 せいかい！";

        // 正解したら苦手リストから外す
        weakKanji =
            weakKanji.filter(k => k !== q.answer);

    } else {

        result.textContent =
            `💡 正解は「${q.answer}」だよ。`;

        // 間違えた漢字を苦手リストに追加
        if (!weakKanji.includes(q.answer)) {

            weakKanji.push(q.answer);
        }
    }

    // 保存
    localStorage.setItem(
        "weakKanji",
        JSON.stringify(weakKanji)
    );

    // もう一度答えられないようにする
    document
        .querySelectorAll("#choices button")
        .forEach(button => {

            button.disabled = true;

        });

    const nextButton =
        document.createElement("button");

    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "🏆 結果を見る"
            : "➡️ 次へ";

    nextButton.onclick = nextQuestion;

    document
        .querySelector(".quiz")
        .appendChild(nextButton);
}


// ========================
// 次の問題
// ========================

function nextQuestion() {

    currentQuestion++;

    if (currentQuestion >= questions.length) {

        showResult();

    } else {

        showQuestion();

    }
}


// ========================
// 結果
// ========================

function showResult() {

    document.body.innerHTML = `

        <div class="container">

            <h1>🏆 結果</h1>

            <p class="result-score">

                ${questions.length}問中

                <strong>${score}問</strong>

                正解！

            </p>

            <button onclick="location.reload()">

                🌳 もう一度やる

            </button>

        </div>
    `;
}


// ========================
// 成績
// ========================

function showScore() {

    document.body.innerHTML = `

        <div class="container">

            <h1>📊 せいせき</h1>

            <p class="result-score">

                ⭐ 苦手な漢字

                <strong>${weakKanji.length}字</strong>

            </p>

            ${
                weakKanji.length === 0
                    ? "<p>まだ苦手な漢字はありません😊</p>"
                    : `<p>${weakKanji.join("　")}</p>`
            }

            <button onclick="location.reload()">

                🌳 ホームへ

            </button>

        </div>
    `;
}

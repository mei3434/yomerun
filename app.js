let questions = [];
let currentQuestion = 0;
let score = 0;
let quizMode = "sentence";

// 苦手な漢字を保存
let weakKanji = JSON.parse(
    localStorage.getItem("weakKanji") || "[]"
);


// ========================
// ホーム画面のボタン
// ========================

const startBtn = document.getElementById("startBtn");
const readingBtn = document.getElementById("readingBtn");
const reviewBtn = document.getElementById("reviewBtn");
const scoreBtn = document.getElementById("scoreBtn");

if (startBtn) {
    startBtn.onclick = startQuiz;
}

if (readingBtn) {
    readingBtn.onclick = startReadingQuiz;
}

if (reviewBtn) {
    reviewBtn.onclick = startWeakQuiz;
}

if (scoreBtn) {
    scoreBtn.onclick = showScore;
}


// ========================
// 文の中で読む
// ========================

async function startQuiz() {

    try {

        const response =
            await fetch("data/kanji5.json");

        questions = await response.json();

        currentQuestion = 0;
        score = 0;
        quizMode = "sentence";

        showQuestion();

    } catch (error) {

        console.error(error);

        alert("問題データを読み込めませんでした。");

    }
}


// ========================
// 漢字の読み方
// ========================

async function startReadingQuiz() {

    try {

        const response =
            await fetch("data/kanji5.json");

        questions = await response.json();

        currentQuestion = 0;
        score = 0;
        quizMode = "reading";

        showQuestion();

    } catch (error) {

        console.error(error);

        alert("問題データを読み込めませんでした。");

    }
}


// ========================
// 苦手だけ
// ========================

async function startWeakQuiz() {

    try {

        const response =
            await fetch("data/kanji5.json");

        const allQuestions =
            await response.json();

        questions = allQuestions.filter(
            q => weakKanji.includes(q.answer)
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
        quizMode = "sentence";

        showQuestion();

    } catch (error) {

        console.error(error);

        alert("問題データを読み込めませんでした。");

    }
}


// ========================
// 問題を表示
// ========================

function showQuestion() {

    if (questions.length === 0) {

        alert("問題がありません。");
        return;

    }

    const q = questions[currentQuestion];

    if (quizMode === "reading") {

        showReadingQuestion(q);

    } else {

        showSentenceQuestion(q);

    }
}


// ========================
// 文の中で読む問題
// ========================

function showSentenceQuestion(q) {

    document.body.innerHTML = `

        <div class="container quiz">

            <p class="question-number">
                問題 ${currentQuestion + 1} / ${questions.length}
            </p>

            <h2>
                ${q.sentence}
            </h2>

            <p class="question-text">
                「${q.question}」はどれ？
            </p>

            <div id="choices"></div>

            <p id="result"></p>

        </div>

    `;

    createChoices(q, q.choices);
}


// ========================
// 漢字を見て読む問題
// ========================

function showReadingQuestion(q) {

    const choices =
        makeReadingChoices(q);

    document.body.innerHTML = `

        <div class="container quiz">

            <p class="question-number">
                🔤 漢字の読み方
            </p>

            <div class="kanji-card">

                <div class="big-kanji">
                    ${q.kanji}
                </div>

            </div>

            <p class="question-text">
                なんて読む？
            </p>

            <div id="choices"></div>

            <p id="result"></p>

        </div>

    `;

    createChoices(q, choices);
}


// ========================
// 読み方の選択肢
// ========================

function makeReadingChoices(q) {

    const correct =
        q.reading;

    const wrong =
        q.choices.filter(
            choice => choice !== correct
        );

    let choices = [correct];

    for (
        let i = 0;
        i < wrong.length &&
        choices.length < 4;
        i++
    ) {

        choices.push(wrong[i]);

    }

    return shuffle(choices);
}


// ========================
// 選択肢を表示
// ========================

function createChoices(q, choices) {

    const choicesArea =
        document.getElementById("choices");

    choices.forEach(choice => {

        const button =
            document.createElement("button");

        button.textContent =
            choice;

        button.onclick = function () {

            checkAnswer(choice, q);

        };

        choicesArea.appendChild(button);

    });
}


// ========================
// 答え合わせ
// ========================

function checkAnswer(choice, q) {

    const result =
        document.getElementById("result");

    let correctAnswer;

    if (quizMode === "reading") {

        correctAnswer =
            q.reading;

    } else {

        correctAnswer =
            q.answer;

    }


    if (choice === correctAnswer) {

        score++;

        result.textContent =
            "🎉 せいかい！";

        // 正解したら苦手から外す
        weakKanji =
            weakKanji.filter(
                kanji => kanji !== q.answer
            );

    } else {

        result.textContent =
            `💡 正解は「${correctAnswer}」だよ。`;

        // 間違えたら苦手に追加
        if (!weakKanji.includes(q.answer)) {

            weakKanji.push(q.answer);

        }

    }


    // 苦手データを保存
    localStorage.setItem(
        "weakKanji",
        JSON.stringify(weakKanji)
    );


    // 選択肢を押せなくする
    document
        .querySelectorAll("#choices button")
        .forEach(button => {

            button.disabled = true;

        });


    // 次へボタン
    const nextButton =
        document.createElement("button");

    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextButton.textContent =
            "🏆 結果を見る";

    } else {

        nextButton.textContent =
            "➡️ 次へ";

    }


    nextButton.onclick =
        nextQuestion;


    document
        .querySelector(".quiz")
        .appendChild(nextButton);
}


// ========================
// 次の問題
// ========================

function nextQuestion() {

    currentQuestion++;

    if (
        currentQuestion >=
        questions.length
    ) {

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

                <strong>
                    ${score}問
                </strong>

                正解！

            </p>

            <button
                onclick="location.reload()"
            >
                🌳 ホームへ
            </button>

        </div>

    `;
}


// ========================
// 成績
// ========================

function showScore() {

    let weakList = "";

    if (weakKanji.length === 0) {

        weakList =
            "<p>まだ苦手な漢字はありません😊</p>";

    } else {

        weakList = `
            <p class="weak-list">
                ${weakKanji.join("　")}
            </p>
        `;

    }


    document.body.innerHTML = `

        <div class="container">

            <h1>📊 せいせき</h1>

            <div class="result-score">

                ⭐ 苦手な漢字

                <strong>
                    ${weakKanji.length}字
                </strong>

            </div>

            ${weakList}

            <button
                onclick="location.reload()"
            >
                🌳 ホームへ
            </button>

        </div>

    `;
}


// ========================
// 選択肢をシャッフル
// ========================

function shuffle(array) {

    const result =
        [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];

    }

    return result;
}

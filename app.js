let questions = [];
let currentQuestion = 0;
let score = 0;
let quizMode = "sentence";

// 苦手な漢字
let weakKanji = JSON.parse(
    localStorage.getItem("weakKanji") || "[]"
);

// ホーム画面のボタン
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
// 問題表示
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
// 文の中で読む
// ========================

function

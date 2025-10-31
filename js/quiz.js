console.log("Quiz loaded");

let currentQuestionIndex = 0;
let questions = [];

async function loadQuestions() {
  const res = await fetch("data/questions.json");
  questions = await res.json();
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  if (currentQuestionIndex >= questions.length) {
    container.innerHTML = "<h2>🎉 You finished all questions!</h2>";
    return;
  }

  const q = questions[currentQuestionIndex];
  const questionEl = document.createElement("h3");
  questionEl.textContent = q.question;

  container.appendChild(questionEl);

  q.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    container.appendChild(btn);
  });
}

function checkAnswer(choice) {
  const correct = questions[currentQuestionIndex].answer;
  const container = document.getElementById("quiz-container");

  if (choice === correct) {
    container.innerHTML = "<p style='color:lime;'>✅ Correct!</p>";
  } else {
    container.innerHTML = `<p style='color:red;'>❌ Wrong! Correct answer: ${correct}</p>`;
  }

  currentQuestionIndex++;
  setTimeout(showQuestion, 1000);
}

window.onload = loadQuestions;

console.log("Quiz loaded");

// ================= Variables =================
let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let power = 0; // 0-100
let playerHP = 100;
let enemyHP = 100;

// ================= Load Questions =================
async function loadQuestions() {
  try {
    const res = await fetch("data/questions.json");
    questions = await res.json();
    showQuestion();
  } catch (err) {
    console.error("Failed to load questions:", err);
  }
}

// ================= Show a Question =================
function showQuestion() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  // Check if questions are finished
  if (currentQuestionIndex >= questions.length) {
    container.innerHTML = "<h2>🎉 All questions answered!</h2>";
    return;
  }

  const q = questions[currentQuestionIndex];
  const questionEl = document.createElement("h3");
  questionEl.textContent = q.question;
  container.appendChild(questionEl);

  // Create choice buttons
  q.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    container.appendChild(btn);
  });
}

// ================= Check Answer =================
function checkAnswer(choice) {
  const correct = questions[currentQuestionIndex].answer;
  const container = document.getElementById("quiz-container");

  if (choice === correct) {
    // ✅ Correct answer
    score += 10;
    power = Math.min(power + 20, 100);
    enemyHP = Math.max(enemyHP - 20, 0);
    container.innerHTML = "<p style='color:lime;'>✅ Correct! You attack the enemy!</p>";
    flashCharacter("enemy"); // visual feedback
  } else {
    // ❌ Wrong answer
    playerHP = Math.max(playerHP - 20, 0);
    container.innerHTML = `<p style='color:red;'>❌ Wrong! The enemy strikes back!</p>`;
    flashCharacter("player"); // visual feedback
  }

  // Update UI
  updateUI();

  // Check win/lose conditions
  if (enemyHP === 0) {
    container.innerHTML = "<h2>🎉 You win!</h2>";
    return;
  }
  if (playerHP === 0) {
    container.innerHTML = "<h2>💀 You lost...</h2>";
    return;
  }

  currentQuestionIndex++;
  setTimeout(showQuestion, 1000);
}

// ================= Update UI =================
function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("power-fill").style.width = power + "%";
  document.getElementById("player-hp").style.width = playerHP + "%";
  document.getElementById("enemy-hp").style.width = enemyHP + "%";
}

// ================= Flash Character =================
function flashCharacter(charId) {
  const char = document.getElementById(charId);
  if (!char) return;
  char.style.transition = "0.1s";
  char.style.opacity = 0.3;
  setTimeout(() => {
    char.style.opacity = 1;
  }, 150);
}

// ================= Initialize =================
window.onload = loadQuestions;

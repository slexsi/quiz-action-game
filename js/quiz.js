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
    document.getElementById("quiz-container").innerHTML =
      "<p style='color:red;'>Failed to load questions.json</p>";
  }
}

// ================= Show a Question =================
function showQuestion() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  if (currentQuestionIndex >= questions.length) {
    container.innerHTML = "<h2>🎉 All questions answered!</h2>";
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

// ================= Check Answer =================
function checkAnswer(choice) {
  const correct = questions[currentQuestionIndex].answer;
  const container = document.getElementById("quiz-container");

  if (choice === correct) {
    score += 10;
    power = Math.min(power + 20, 100);
    enemyHP = Math.max(enemyHP - 20, 0);
    container.innerHTML = "<p style='color:lime;'>✅ Correct! You attack the enemy!</p>";
    attackAnimation("player", "enemy");
    document.getElementById("hit-sound").play();
  } else {
    playerHP = Math.max(playerHP - 20, 0);
    container.innerHTML = `<p style='color:red;'>❌ Wrong! The enemy strikes back!</p>`;
    attackAnimation("enemy", "player");
    document.getElementById("hit-sound").play();
  }

  updateUI();

  // Check win/lose
  if (enemyHP === 0) {
    container.innerHTML = `
      <h2 style="color:green;">Damn GGs, check the losing screen mayb?</h2>
      <button onclick="location.reload()">Play Again</button>
    `;
    document.getElementById("win-sound").play();
    return;
  }
  if (playerHP === 0) {
    container.innerHTML = `
      <h2 style="color:red;">L + NO SWEAT + GO STUDY!</h2>
      <button onclick="location.reload()">Retry</button>
    `;
    document.getElementById("lose-sound").play();
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

// ================= Attack Animation =================
function attackAnimation(attackerId, targetId) {
  const attacker = document.getElementById(attackerId);
  const target = document.getElementById(targetId);
  if (!attacker || !target) return;

  attacker.style.transition = "0.2s";
  attacker.style.transform = "translateX(20px)";

  setTimeout(() => {
    attacker.style.transform = "translateX(0)";
    flashCharacter(targetId);
  }, 200);
}

// ================= Enemy AI =================
function startEnemyAI() {
  setInterval(() => {
    if (playerHP <= 0 || enemyHP <= 0) return;

    if (Math.random() < 0.5) {
      warnEnemyAttack();
      setTimeout(() => {
        playerHP = Math.max(playerHP - 15, 0);
        attackAnimation("enemy", "player");
        document.getElementById("hit-sound").play();
        updateUI();

        if (playerHP === 0) {
          document.getElementById("quiz-container").innerHTML = `
            <h2 style="color:red;">💀 You lost...</h2>
            <button onclick="location.reload()">Retry</button>
          `;
          document.getElementById("lose-sound").play();
        }
      }, 800);
    }
  }, 3000 + Math.random() * 2000); // 3-5 sec interval
}

// ================= Warning Effect =================
function warnEnemyAttack() {
  const enemy = document.getElementById("enemy");
  enemy.style.transition = "0.2s";
  enemy.style.transform = "translateY(-10px)";
  enemy.style.opacity = 0.6;

  setTimeout(() => {
    enemy.style.transform = "translateY(0)";
    enemy.style.opacity = 1;
  }, 500);
}

// ================= Background Music & Mute =================
window.onload = function() {
  loadQuestions();
  startEnemyAI();

  const bgm = document.getElementById("bgm");
  bgm.volume = 0.3;

  // Autoplay on first click if blocked
  document.getElementById("game-container").addEventListener("click", () => {
    bgm.play().catch(err => {});
  }, { once: true });

  // Mute button
  const muteBtn = document.getElementById("mute-btn");
  muteBtn.onclick = () => {
    bgm.muted = !bgm.muted;
    muteBtn.textContent = bgm.muted ? "🔇 Muted" : "🔊 Unmuted";
  };
};

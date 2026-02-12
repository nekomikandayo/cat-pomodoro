// ===== 初期設定 =====
let timeLeft = 1500; // 25分（秒）
let timerId = null;
let isRunning = false;

// ===== 要素取得 =====
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// ===== 表示更新 =====
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

// ===== タイマー開始 =====
function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerId);
      isRunning = false;
      alert("25分終了！🐱");
    }
  }, 1000);
}

// ===== リセット =====
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = 1500;
  updateDisplay();
}

// ===== イベント登録 =====
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// 初期表示
updateDisplay();

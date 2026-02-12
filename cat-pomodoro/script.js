// ====== 初期設定 ======
let timeLeft = 1500; // 25分
let timerId = null;
let isRunning = false;

// ====== 要素取得 ======
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

// ====== 表示更新 ======
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ====== タイマー開始 ======
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

// ====== 停止 ======
function stopTimer() {
  clearInterval(timerId);
  isRunning = false;
}

// ====== リセット ======
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = 1500;
  updateDisplay();
}

// ====== イベント登録 ======
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

// 初期表示
updateDisplay();

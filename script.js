// ===== 初期設定 =====
let WORK_TIME = 1500;   // 25分
let BREAK_TIME = 300;   // 5分

let timeLeft = WORK_TIME;
let timerId = null;
let isRunning = false;
let mode = "work"; // "work" or "break"
let sessionCount = 0;

// ===== 要素取得 =====
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const modeDisplay = document.getElementById("modeDisplay");
const sessionEl = document.getElementById("sessionCount");

// ===== 表示更新 =====
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

// ===== モード表示更新 =====
function updateModeDisplay() {
  if (mode === "work") {
    modeDisplay.textContent = "集中モード";
  } else {
    modeDisplay.textContent = "休憩モード";
  }
}

// ===== モード切替 =====
function switchMode() {
  if (mode === "work") {
    sessionCount++; // 作業終了時のみ加算
    sessionEl.textContent = sessionCount;

    mode = "break";
    timeLeft = BREAK_TIME;
  } else {
    mode = "work";
    timeLeft = WORK_TIME;
  }

  updateModeDisplay();
  updateDisplay();
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
      switchMode();
    }
  }, 1000);
}

// ===== リセット =====
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  mode = "work";
  timeLeft = WORK_TIME;
  updateModeDisplay();
  updateDisplay();
}

// ===== イベント登録 =====
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// 初期表示
updateDisplay();
updateModeDisplay();

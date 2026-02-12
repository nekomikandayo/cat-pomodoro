// ===== 初期設定 =====
let WORK_TIME = 1500;
let BREAK_TIME = 300;

let mode = "work";
let timeLeft = WORK_TIME;
let timerId = null;
let isRunning = false;

// ===== 保存データ読み込み =====
let sessionCount = Number(localStorage.getItem("catPomodoro_sessionCount")) || 0;
let totalFocusTime = Number(localStorage.getItem("catPomodoro_totalTime")) || 0;

// ===== 要素取得 =====
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const modeDisplay = document.getElementById("modeDisplay");
const sessionEl = document.getElementById("sessionCount");
const totalTimeEl = document.getElementById("totalTime");

// ===== 表示更新 =====
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

function updateModeDisplay() {
  modeDisplay.textContent = mode === "work" ? "集中モード" : "休憩モード";
}

function updateSessionDisplay() {
  sessionEl.textContent = sessionCount;
}

function updateTotalTimeDisplay() {
  totalTimeEl.textContent = Math.floor(totalFocusTime / 60);
}

// ===== データ保存 =====
function saveData() {
  localStorage.setItem("catPomodoro_sessionCount", sessionCount);
  localStorage.setItem("catPomodoro_totalTime", totalFocusTime);
}

// ===== モード切替 =====
function switchMode() {
  if (mode === "work") {
    sessionCount++;
    totalFocusTime += WORK_TIME;

    saveData();
    updateSessionDisplay();
    updateTotalTimeDisplay();

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

// ===== 初期表示 =====
updateDisplay();
updateModeDisplay();
updateSessionDisplay();
updateTotalTimeDisplay();

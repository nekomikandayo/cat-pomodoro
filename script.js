// ===== 初期設定 =====
let WORK_TIME = Number(localStorage.getItem("catPomodoro_workTime")) || 1500;
let BREAK_TIME = Number(localStorage.getItem("catPomodoro_breakTime")) || 300;

let mode = "work";
let timeLeft = WORK_TIME;
let timerId = null;
let isRunning = false;

// 画像パス
const WORK_IMAGE_PATH = "images/studying_cat.png";
const BREAK_IMAGE_PATH = "images/sleeping_cat.png";

// 音声ファイル（オプション）
const alarmSound = new Audio("お知らせベル.mp3");

// ===== 保存データ読み込み =====
let sessionCount = Number(localStorage.getItem("catPomodoro_sessionCount")) || 0;
let totalFocusTime = Number(localStorage.getItem("catPomodoro_totalTime")) || 0;

// ===== 要素取得 =====
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const modeDisplay = document.getElementById("modeDisplay");
const sessionEl = document.getElementById("sessionCount");
const totalTimeEl = document.getElementById("totalTime");
const currentTimeEl = document.getElementById("currentTime");
const settingBtn = document.getElementById("settingBtn");
const modal = document.getElementById("settingsModal");
const workInput = document.getElementById("workInput");
const breakInput = document.getElementById("breakInput");
const saveSettingsBtn = document.getElementById("saveSettings");
const closeModalBtn = document.getElementById("closeModal");

// ===== 表示更新 =====
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

function updateModeDisplay() {
  modeDisplay.textContent = mode === "work" ? "集中モード" : "休憩モード";
  document.body.classList.remove("work", "break");
  document.body.classList.add(mode);

  const catImageEl = document.getElementById("catImage");
  if (catImageEl) {
    catImageEl.src = mode === "work" ? WORK_IMAGE_PATH : BREAK_IMAGE_PATH;
  }
}

// ===== タイマー制御 =====
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
  pauseBtn.textContent = "Pause";
}

function pauseTimer() {
  if (isRunning) {
    clearInterval(timerId);
    isRunning = false;
    pauseBtn.textContent = "Resume";
  } else if (timeLeft < (mode === "work" ? WORK_TIME : BREAK_TIME)) {
    startTimer();
  }
}

function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  mode = "work";
  timeLeft = WORK_TIME;
  pauseBtn.textContent = "Pause";
  updateModeDisplay();
  updateDisplay();
}

function switchMode() {
  alarmSound.play().catch(e => console.log("音声再生に失敗しました"));
  
  const wasRunning = isRunning;
  
if (mode === "work") {
  sessionCount++;
  totalFocusTime += WORK_TIME / 60;
  
  // 日付ごとの保存（秒で保存）
  saveDailyFocus(WORK_TIME);
  
  mode = "break";
  timeLeft = BREAK_TIME;
} else {
  mode = "work";
  timeLeft = WORK_TIME;
}
  
  saveData();
  updateSessionDisplay();
  updateTotalTimeDisplay();
  updateModeDisplay();
  updateDisplay();

  if (wasRunning) {
    clearInterval(timerId);
    isRunning = false;
    startTimer();
  }
}

// ===== モーダル関連 =====
function openSettingsModal() {
  workInput.value = WORK_TIME / 60;
  breakInput.value = BREAK_TIME / 60;
  modal.classList.remove("hidden");
}

function closeSettingsModal() {
  modal.classList.add("hidden");
}

function saveSettings() {
  WORK_TIME = Number(workInput.value) * 60;
  BREAK_TIME = Number(breakInput.value) * 60;
  localStorage.setItem("catPomodoro_workTime", WORK_TIME);
  localStorage.setItem("catPomodoro_breakTime", BREAK_TIME);
  
  resetTimer();
  modal.classList.add("hidden");
}

// ===== その他更新系 =====
function updateClock() {
  const now = new Date();
  currentTimeEl.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function saveData() {
  localStorage.setItem("catPomodoro_sessionCount", sessionCount);
  localStorage.setItem("catPomodoro_totalTime", totalFocusTime);
}

function resetDailyStats() {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem("catPomodoro_lastDate");
  
  if (lastDate !== today) {
    totalFocusTime = 0;
    sessionCount = 0;
    localStorage.setItem("catPomodoro_lastDate", today);
    localStorage.setItem("catPomodoro_totalTime", 0);
    localStorage.setItem("catPomodoro_sessionCount", 0);
  }
}

function updateSessionDisplay() { 
  sessionEl.textContent = sessionCount; 
}

function updateTotalTimeDisplay() { 
  totalTimeEl.textContent = Math.floor(totalFocusTime); 
}

function saveDailyFocus(seconds) {
  const today = new Date().toISOString().split("T")[0];

  const history = JSON.parse(localStorage.getItem("focusHistory")) || {};

  if (!history[today]) {
    history[today] = 0;
  }

  history[today] += seconds;

  localStorage.setItem("focusHistory", JSON.stringify(history));
}

// ===== イベント登録 =====
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
settingBtn.addEventListener("click", openSettingsModal);
closeModalBtn.addEventListener("click", closeSettingsModal);
saveSettingsBtn.addEventListener("click", saveSettings);

// ===== 初期起動 =====
resetDailyStats();
updateDisplay();
updateModeDisplay();
updateSessionDisplay();
updateTotalTimeDisplay();
setInterval(updateClock, 1000);
updateClock();

console.log("Pomodoro Timer が正常に読み込まれました");

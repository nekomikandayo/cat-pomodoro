// ===== 初期設定 =====
let WORK_TIME = Number(localStorage.getItem("catPomodoro_workTime")) || 1500;
let BREAK_TIME = Number(localStorage.getItem("catPomodoro_breakTime")) || 300;

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
}

function updateSessionDisplay() {
  sessionEl.textContent = sessionCount;
}

function updateTotalTimeDisplay() {
  totalTimeEl.textContent = Math.floor(totalFocusTime / 60);
}

// ===== 現在時刻表示 =====
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  currentTimeEl.textContent = `${hours}:${minutes}`;
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

function openSettings() {
  const newWork = prompt("作業時間（分）を入力してください", WORK_TIME / 60);
  const newBreak = prompt("休憩時間（分）を入力してください", BREAK_TIME / 60);

  if (newWork !== null && newBreak !== null) {
    WORK_TIME = Number(newWork) * 60;
    BREAK_TIME = Number(newBreak) * 60;

    localStorage.setItem("catPomodoro_workTime", WORK_TIME);
    localStorage.setItem("catPomodoro_breakTime", BREAK_TIME);

    // 現在work中なら反映
    if (mode === "work") {
      timeLeft = WORK_TIME;
    } else {
      timeLeft = BREAK_TIME;
    }

    updateDisplay();
    alert("設定を保存しました 🐱");
  }
}

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

  timeLeft = mode === "work" ? WORK_TIME : BREAK_TIME;
  updateDisplay();

  closeSettingsModal();
}

// ===== イベント登録 =====
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
settingBtn.addEventListener("click", openSettings);
settingBtn.addEventListener("click", openSettingsModal);
closeModalBtn.addEventListener("click", closeSettingsModal);
saveSettingsBtn.addEventListener("click", saveSettings);

// ===== 初期表示 =====
updateDisplay();
updateModeDisplay();
updateSessionDisplay();
updateTotalTimeDisplay();
updateClock();

// 1秒ごとに現在時刻更新
setInterval(updateClock, 1000);

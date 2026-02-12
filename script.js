// ===== 初期設定 =====
let WORK_TIME = Number(localStorage.getItem("catPomodoro_workTime")) || 1500;
let BREAK_TIME = Number(localStorage.getItem("catPomodoro_breakTime")) || 300;

let mode = "work";
let timeLeft = WORK_TIME;
let timerId = null;
let isRunning = false;

const WORK_IMAGE_PATH = "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='80' font-size='80'%3E💻%3C/text%3E%3Ctext y='70' x='20' font-size='50'%3E🐱%3C/text%3E%3C/svg%3E"; // 集中モード：パソコンと猫

const BREAK_IMAGE_PATH = "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cstyle%3E .stretch %7B animation: stretch-anim 1.5s ease-in-out infinite alternate; transform-origin: bottom; %7D @keyframes stretch-anim %7B from %7B transform: scaleX(1); %7D to %7B transform: scaleX(1.3) skewX(-10deg); %7D %7D %3C/style%3E%3Ctext y='80' font-size='80' class='stretch'%3E🐈%3C/text%3E%3C/svg%3E"; // 休憩モード：伸びる猫（アニメーション付）

// 音声ファイルの読み込み（ファイルが同じフォルダにあるか確認してくださいね！）
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
    // 停止処理
    clearInterval(timerId);
    isRunning = false;
    pauseBtn.textContent = "Resume";
  } else if (timeLeft < (mode === "work" ? WORK_TIME : BREAK_TIME)) {
    // 再開処理（時間が進んでいる場合のみ）
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
  alarmSound.play().catch(e => console.log("音声再生に失敗しました（ユーザー操作が必要です）"));
  
  if (mode === "work") {
    sessionCount++;
    totalFocusTime += WORK_TIME / 60; // 分単位で加算
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
}

// ===== モーダル関連 =====
function openSettingsModal() {
  workInput.value = WORK_TIME / 60;
  breakInput.value = BREAK_TIME / 60;
  modal.classList.remove("hidden");
}

function saveSettings() {
  WORK_TIME = Number(workInput.value) * 60;
  BREAK_TIME = Number(breakInput.value) * 60;
  localStorage.setItem("catPomodoro_workTime", WORK_TIME);
  localStorage.setItem("catPomodoro_breakTime", BREAK_TIME);
  
  resetTimer(); // 設定変更時はリセット
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

function updateSessionDisplay() { sessionEl.textContent = sessionCount; }
function updateTotalTimeDisplay() { totalTimeEl.textContent = Math.floor(totalFocusTime); }

// ===== イベント登録 =====
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
settingBtn.addEventListener("click", openSettingsModal);
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
saveSettingsBtn.addEventListener("click", saveSettings);

// 初期起動
updateDisplay();
updateModeDisplay();
updateSessionDisplay();
updateTotalTimeDisplay();
setInterval(updateClock, 1000);
updateClock();

// ===== 初期設定 =====
let WORK_TIME = Number(localStorage.getItem("catPomodoro_workTime")) || 1500;
let BREAK_TIME = Number(localStorage.getItem("catPomodoro_breakTime")) || 300;

let mode = "work";
let timeLeft = WORK_TIME;
let timerId = null;
let isRunning = false;

// 集中モード：勉強している猫（ペンが動く）
const WORK_IMAGE_PATH = "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cstyle%3E .pen %7B animation: write 1s ease-in-out infinite; transform-origin: 140px 100px; %7D @keyframes write %7B 0%25, 100%25 %7B transform: rotate(0deg); %7D 50%25 %7B transform: rotate(-15deg); %7D %7D .tail %7B animation: tail-wag 1.5s ease-in-out infinite; transform-origin: 50px 120px; %7D @keyframes tail-wag %7B 0%25, 100%25 %7B transform: rotate(0deg); %7D 50%25 %7B transform: rotate(20deg); %7D %7D %3C/style%3E%3C!-- 机 --%3E%3Crect x='40' y='110' width='120' height='8' fill='%23D2691E'/%3E%3Crect x='50' y='118' width='8' height='40' fill='%23A0522D'/%3E%3Crect x='142' y='118' width='8' height='40' fill='%23A0522D'/%3E%3C!-- ノート --%3E%3Crect x='80' y='90' width='60' height='40' fill='white' stroke='%23333' stroke-width='2'/%3E%3Cline x1='85' y1='100' x2='130' y2='100' stroke='%23CCC' stroke-width='1'/%3E%3Cline x1='85' y1='108' x2='130' y2='108' stroke='%23CCC' stroke-width='1'/%3E%3Cline x1='85' y1='116' x2='130' y2='116' stroke='%23CCC' stroke-width='1'/%3E%3C!-- 猫の体 --%3E%3Cellipse cx='70' cy='100' rx='25' ry='20' fill='%23FF9933'/%3E%3C!-- 猫の頭 --%3E%3Ccircle cx='85' cy='85' r='18' fill='%23FF9933'/%3E%3C!-- 耳 --%3E%3Cpolygon points='75,70 72,80 78,78' fill='%23FF9933'/%3E%3Cpolygon points='95,70 98,80 92,78' fill='%23FF9933'/%3E%3C!-- 目（集中している） --%3E%3Cellipse cx='80' cy='85' rx='2' ry='3' fill='black'/%3E%3Cellipse cx='90' cy='85' rx='2' ry='3' fill='black'/%3E%3C!-- 口 --%3E%3Cpath d='M 82 90 Q 85 92 88 90' stroke='black' fill='none' stroke-width='1'/%3E%3C!-- しっぽ --%3E%3Cpath class='tail' d='M 50 120 Q 40 110 45 95' stroke='%23FF9933' stroke-width='6' fill='none' stroke-linecap='round'/%3E%3C!-- ペン --%3E%3Cg class='pen'%3E%3Cline x1='140' y1='100' x2='145' y2='95' stroke='%233498db' stroke-width='3' stroke-linecap='round'/%3E%3Ccircle cx='140' cy='100' r='2' fill='%232c3e50'/%3E%3C/g%3E%3C/svg%3E";

// 休憩モード：ベッドで寝ている猫（呼吸で体が動く）
const BREAK_IMAGE_PATH = "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cstyle%3E .sleeping-cat %7B animation: breathe 2s ease-in-out infinite; transform-origin: center; %7D @keyframes breathe %7B 0%25, 100%25 %7B transform: scaleY(1); %7D 50%25 %7B transform: scaleY(1.05); %7D %7D .zzz %7B animation: float 2s ease-in-out infinite; opacity: 0.7; %7D @keyframes float %7B 0%25 %7B transform: translateY(0px); opacity: 0.7; %7D 50%25 %7B transform: translateY(-10px); opacity: 0.3; %7D 100%25 %7B transform: translateY(0px); opacity: 0.7; %7D %7D %3C/style%3E%3C!-- ベッド --%3E%3Crect x='40' y='120' width='120' height='15' rx='5' fill='%23E8B4B8'/%3E%3Crect x='35' y='135' width='130' height='20' rx='3' fill='%23DDA0A4'/%3E%3C!-- 枕 --%3E%3Cellipse cx='140' cy='110' rx='25' ry='12' fill='%23B8D4E8'/%3E%3C!-- 寝ている猫 --%3E%3Cg class='sleeping-cat'%3E%3C!-- 体 --%3E%3Cellipse cx='100' cy='115' rx='40' ry='18' fill='%23FF9933'/%3E%3C!-- 頭 --%3E%3Cellipse cx='125' cy='108' rx='20' ry='16' fill='%23FF9933'/%3E%3C!-- 耳 --%3E%3Cpolygon points='120,95 118,103 123,101' fill='%23FF9933'/%3E%3Cpolygon points='135,95 137,103 132,101' fill='%23FF9933'/%3E%3C!-- 目（閉じている） --%3E%3Cpath d='M 120 106 Q 122 108 124 106' stroke='black' fill='none' stroke-width='1.5'/%3E%3Cpath d='M 128 106 Q 130 108 132 106' stroke='black' fill='none' stroke-width='1.5'/%3E%3C!-- 口（リラックス） --%3E%3Cpath d='M 123 112 Q 126 113 129 112' stroke='black' fill='none' stroke-width='1'/%3E%3C!-- しっぽ --%3E%3Cpath d='M 65 118 Q 55 120 52 115' stroke='%23FF9933' stroke-width='7' fill='none' stroke-linecap='round'/%3E%3C/g%3E%3C!-- ZZZ（寝息） --%3E%3Ctext class='zzz' x='145' y='85' font-size='16' fill='%236C5CE7' font-weight='bold'%3EZ%3C/text%3E%3Ctext class='zzz' x='155' y='75' font-size='14' fill='%236C5CE7' font-weight='bold' style='animation-delay: 0.3s'%3Ez%3C/text%3E%3Ctext class='zzz' x='165' y='68' font-size='12' fill='%236C5CE7' font-weight='bold' style='animation-delay: 0.6s'%3Ez%3C/text%3E%3C/svg%3E";

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
  
  const wasRunning = isRunning; // 🔥 実行状態を保存
  
  if (mode === "work") {
    sessionCount++;
    totalFocusTime += WORK_TIME / 60;
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

  // 🔥 実行中だった場合のみ自動再開
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

// 🔥 日付リセット関数（今日の統計をリセット）
function resetDailyStats() {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem("catPomodoro_lastDate");
  
  if (lastDate !== today) {
    totalFocusTime = 0;
    sessionCount = 0; // セッション回数もリセットする場合
    localStorage.setItem("catPomodoro_lastDate", today);
    localStorage.setItem("catPomodoro_totalTime", 0);
    localStorage.setItem("catPomodoro_sessionCount", 0);
  }
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

// ===== 初期起動 =====
resetDailyStats(); // 🔥 日付チェック＆リセット
updateDisplay();
updateModeDisplay();
updateSessionDisplay();
updateTotalTimeDisplay();
setInterval(updateClock, 1000);
updateClock();

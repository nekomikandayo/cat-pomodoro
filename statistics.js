document.addEventListener("DOMContentLoaded", () => {
  const historyList = document.getElementById("historyList");

  const history = JSON.parse(localStorage.getItem("focusHistory")) || {};

  const dates = Object.keys(history);

  if (dates.length === 0) {
    historyList.innerHTML = "<p>まだ記録がありません。</p>";
    return;
  }

  // 日付順（新しい順）に並べる
  dates.sort((a, b) => new Date(b) - new Date(a));

  dates.forEach(date => {
    const seconds = history[date];
    const minutes = Math.floor(seconds / 60);

    const item = document.createElement("div");
    item.classList.add("history-item");

    item.innerHTML = `
      <strong>${date}</strong>
      <p>${minutes} 分</p>
    `;

    historyList.appendChild(item);
  });
   const totalMinutes = Math.floor(totalSeconds / 60);

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total-time");

  totalDiv.innerHTML = `
    <h2>🧮 総合計時間</h2>
    <p>${totalMinutes} 分</p>
  `;

  historyList.appendChild(totalDiv);
});

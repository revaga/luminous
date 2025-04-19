const timerDisplay = document.getElementById("timer");
const startStopBtn = document.getElementById("startStop");
const restartBtn = document.getElementById("restart");
const phaseMsg = document.getElementById("phase-message");

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TIMER_UPDATE") {
    timerDisplay.textContent = formatTime(msg.timeLeft);
    startStopBtn.textContent = msg.running ? "stop" : "start";

    const isBreak = msg.phaseIndex === 1;
    phaseMsg.textContent = isBreak ? "\u2615 Break time!" : "\uD83D\uDD12 Lock in time!";
    phaseMsg.style.color = isBreak ? "#3498db" : "#9b59b6";
  }
});

startStopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: startStopBtn.textContent.toLowerCase() });
  if(startStopBtn.textContent === "start") startStopBtn.textContent = "stop";
  else startStopBtn.textContent = "start";
});

restartBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "restart" });
});

chrome.runtime.sendMessage({ command: "sync" });

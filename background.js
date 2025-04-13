let timer = null;
let timeLeft = 1200;
let phaseIndex = 0; // 0 for lock-in, 1 for break
const phases = [1200, 20]; //in seconds (no min)
let running = false;

function notifyPhaseChange() {
  const isBreak = phaseIndex === 1;
  const title = isBreak ? "☕ Break time!" : "🔒 Lock in time!";
  const message = isBreak ? "Take a short 20s break. Look 20ft away for 20s every 20min" : "Focus for 20 min.";

  // Notification
  chrome.notifications.create("phase-alert", {
    type: "basic",
    iconUrl: "icon.png",
    title,
    message,
    priority: 2
  });

  // Badge
  chrome.action.setBadgeText({ text: isBreak ? "☕" : "🔒" });
  chrome.action.setBadgeBackgroundColor({ color: isBreak ? "#3498db" : "#9b59b6" });



  // Tooltip
  chrome.action.setTitle({ title });
}

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      phaseIndex = (phaseIndex + 1) % phases.length;
      timeLeft = phases[phaseIndex];
      notifyPhaseChange();
    }
    broadcastTime();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function restartTimer() {
  phaseIndex = 0;
  timeLeft = phases[phaseIndex];
  notifyPhaseChange();
  broadcastTime();
}

function broadcastTime() {
  chrome.runtime.sendMessage({
    type: "TIMER_UPDATE",
    timeLeft,
    running: !!timer,
    phaseIndex
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "start") startTimer();
  if (msg.command === "stop") stopTimer();
  if (msg.command === "restart") {
    stopTimer();
    restartTimer();
  }
  sendResponse({ success: true });
});

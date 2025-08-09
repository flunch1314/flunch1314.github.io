// Configure this to your endpoint (local Flask server by default)
// If testing locally, ensure server.py is running.
// If deploying, replace with your public https URL (e.g., ngrok) + "/hook".
const LAB_WEBHOOK_URL = "http://127.0.0.1:5000/hook";

function setStatus(text, kind = "info") {
  const el = document.getElementById("labStatus");
  if (!el) return;
  el.textContent = text;
  el.style.color = kind === "error" ? "#ff8a8a" : kind === "success" ? "#86ffa3" : "#a0acc0";
}

async function sendLabMessage(message) {
  if (!LAB_WEBHOOK_URL) {
    throw new Error("No endpoint configured. Set LAB_WEBHOOK_URL in ai-lab.js");
  }
  const payload = {
    message,
    page: location.href,
    timestamp: new Date().toISOString(),
    timezoneOffsetMin: new Date().getTimezoneOffset(),
    userAgent: navigator.userAgent,
  };
  const res = await fetch(LAB_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    mode: "cors",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`.trim());
  }
}

(function initLabForm() {
  const form = document.getElementById("labForm");
  const textarea = document.getElementById("labMessage");
  const sendBtn = document.getElementById("labSend");
  if (!form || !textarea || !sendBtn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = (textarea.value || "").trim();
    if (!msg) {
      setStatus("Please enter a message.", "error");
      textarea.focus();
      return;
    }
    sendBtn.disabled = true;
    setStatus("Sending…");
    try {
      await sendLabMessage(msg);
      setStatus("Sent! Thank you.", "success");
      textarea.value = "";
    } catch (err) {
      console.error(err);
      setStatus("Failed to send. Configure LAB_WEBHOOK_URL in ai-lab.js or try again.", "error");
    } finally {
      sendBtn.disabled = false;
    }
  });
})();


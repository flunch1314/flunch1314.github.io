// Configure this to your endpoint (local Flask server by default)
// If testing locally, ensure server.py is running.
// If deploying, replace with your public https URL (e.g., ngrok) + "/hook".
const LAB_WEBHOOK_URL = "http://127.0.0.1:5000/hook";
function updatePreviewFromServer(result) {
  const imgEl = document.getElementById("labPreview");
  const captionEl = document.getElementById("labPreviewCaption");
  const placeholder = document.getElementById("labPreviewPlaceholder");
  if (!imgEl || !captionEl || !result) return;
  if (result.imageUrl) {
    if (placeholder) placeholder.hidden = true;
    imgEl.src = result.imageUrl;
    const style = result.style || "";
    captionEl.textContent = style ? `Style: ${style}` : "";
    imgEl.hidden = false;
  } else {
    if (placeholder) placeholder.hidden = false;
    imgEl.removeAttribute("src");
    captionEl.textContent = "";
    imgEl.hidden = true;
  }
}

function setStatus(text, kind = "info") {
  const el = document.getElementById("labStatus");
  if (!el) return;
  el.textContent = text;
  el.style.color = kind === "error" ? "#ff8a8a" : kind === "success" ? "#86ffa3" : "#a0acc0";
}

async function sendLabMessage(payload) {
  if (!LAB_WEBHOOK_URL) {
    throw new Error("No endpoint configured. Set LAB_WEBHOOK_URL in ai-lab.js");
  }
  payload = {
    ...payload,
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
  return res.json().catch(() => ({}));
}

(function initLabForm() {
  const form = document.getElementById("labForm");
  const textarea = document.getElementById("labMessage");
  const nameInput = document.getElementById("labName");
  const emailInput = document.getElementById("labEmail");
  const styleSelect = document.getElementById("labStyle");
  const sendBtn = document.getElementById("labSend");
  const statusEl = document.getElementById("labStatus");
  if (!form || !textarea || !sendBtn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = (textarea.value || "").trim();
    const name = (nameInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();
    const style = (styleSelect?.value || "").trim();

    if (!msg) {
      setStatus("Please enter a message.", "error");
      textarea.focus();
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email (or leave it blank).", "error");
      emailInput?.focus();
      return;
    }
    sendBtn.disabled = true;
    setStatus("Sending…");
    try {
      const result = await sendLabMessage({ name, email, style, message: msg });
      setStatus("Sent! Thank you.", "success");
      updatePreviewFromServer(result);
      textarea.value = "";
      if (nameInput) nameInput.value = "";
      if (emailInput) emailInput.value = "";
      if (styleSelect) styleSelect.selectedIndex = 0;
    } catch (err) {
      console.error(err);
      setStatus("Failed to send. Configure LAB_WEBHOOK_URL in ai-lab.js or try again.", "error");
    } finally {
      sendBtn.disabled = false;
    }
  });

  // Keep right preview bottom aligned with left by exposing action height via CSS var
  const observeActionsHeight = () => {
    const actions = document.querySelector('.lab-actions');
    if (!actions) return;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--lab-actions-h', actions.offsetHeight + 'px');
    });
    ro.observe(actions);
    // initialize once
    document.documentElement.style.setProperty('--lab-actions-h', actions.offsetHeight + 'px');
  };
  observeActionsHeight();
})();


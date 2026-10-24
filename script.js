const log = document.querySelector("#log");
const thread = document.querySelector("#thread");
const role = document.querySelector("#role");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const turns = [...log.querySelectorAll(".msg")].map((node) => ({
  role: node.classList.contains("user") ? "user" : "assistant",
  html: node.innerHTML.trim(),
}));

function wait(ms) {
  if (reduced || ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setTyping(on) {
  role.classList.toggle("is-typing", on);
  role.textContent = on ? "typing" : "Founder & Builder";
}

function scrollToEnd() {
  thread.scrollTop = thread.scrollHeight;
}

function showCaret() {
  const item = document.createElement("div");
  item.className = "msg assistant";
  item.setAttribute("aria-hidden", "true");
  item.innerHTML = `<p><span class="caret"></span></p>`;
  log.append(item);
  scrollToEnd();
  return item;
}

function addMessage(who, html) {
  const item = document.createElement("article");
  item.className = `msg ${who}`;
  item.innerHTML = html;
  log.append(item);
  scrollToEnd();
}

async function play() {
  for (const turn of turns) {
    if (turn.role === "assistant" && !reduced) {
      setTyping(true);
      const caret = showCaret();
      await wait(560);
      caret.remove();
      setTyping(false);
    }
    addMessage(turn.role, turn.html);
    await wait(turn.role === "user" ? 420 : 640);
  }
}

if (reduced) {
  log.querySelectorAll(".preload").forEach((node) => node.classList.remove("preload"));
} else {
  log.replaceChildren();
  play();
}

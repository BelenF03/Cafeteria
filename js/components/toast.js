let container;

function getContainer() {
  if (!container) container = document.getElementById("toast-root");
  return container;
}

export const toast = {
  show(message, type = "info", duration = 2800) {
    const root = getContainer();
    const icons = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info" };
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
};
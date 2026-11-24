export const modal = {
  open({ title, content, actions = [] }) {
    const root = document.getElementById("modal-root");
    root.innerHTML = `
      <div class="modal-overlay active">
        <div class="modal">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">${content}</div>
          ${actions.length ? `<div class="modal-actions">${actions.map((a, i) => `<button class="btn-${a.variant || "primary"}" data-modal-action="${i}">${a.label}</button>`).join("")}</div>` : ""}
        </div>
      </div>
    `;
    const close = () => { root.innerHTML = ""; };
    root.querySelector(".modal-close").addEventListener("click", close);
    root.querySelector(".modal-overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) close();
    });
    actions.forEach((a, i) => {
      root.querySelector(`[data-modal-action="${i}"]`).addEventListener("click", () => {
        if (a.onClick) a.onClick(close);
        else close();
      });
    });
    return close;
  }
};
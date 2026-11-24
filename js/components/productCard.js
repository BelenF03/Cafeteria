import { formatPrice, escapeHTML } from "../utils.js";
import { store } from "../store.js";
import { cart } from "../cart.js";
import { toast } from "./toast.js";

export function productCard(p, { link = true } = {}) {
  const isFav = store.get("favorites").includes(p.id);
  const stars = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));

  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        ${p.badge ? `<span class="product-badge">${escapeHTML(p.badge)}</span>` : ""}
        <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${p.id}" aria-label="Favorito">
          <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
        </button>
        <a href="${link ? `#/producto/${p.id}` : "javascript:void(0)"}">
          <img src="${p.img}" alt="${escapeHTML(p.name)}" loading="lazy" />
        </a>
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span class="rating">${stars} <small>(${p.rating})</small></span>
          <span class="stock ${p.stock < 5 ? "low" : ""}">${p.stock < 5 ? "¡Últimas unidades!" : "En stock"}</span>
        </div>
        <h3>${escapeHTML(p.name)}</h3>
        <p>${escapeHTML(p.desc)}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="add-btn" data-add="${p.id}" aria-label="Agregar">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindProductCardEvents(scope = document) {
  scope.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = Number(btn.dataset.add);
      const res = await import("../api.js").then(m => m.api.getProductById(id));
      if (!res) return;
      const result = cart.add(res);
      if (!result.ok) toast.show("No hay más stock disponible", "error");
      else toast.show(`${res.name} agregado 🛒`, "success");
    });
  });

  scope.querySelectorAll("[data-fav]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = Number(btn.dataset.fav);
      const favs = [...store.get("favorites")];
      const idx = favs.indexOf(id);
      if (idx >= 0) favs.splice(idx, 1); else favs.push(id);
      store.set("favorites", favs);
      const icon = btn.querySelector("i");
      const isFav = favs.includes(id);
      btn.classList.toggle("active", isFav);
      icon.className = `fa-${isFav ? "solid" : "regular"} fa-heart`;
    });
  });
}
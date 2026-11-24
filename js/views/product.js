import { api } from "../api.js";
import { formatPrice, escapeHTML } from "../utils.js";
import { cart } from "../cart.js";
import { toast } from "../components/toast.js";
import { productCard, bindProductCardEvents } from "../components/productCard.js";

export async function productView({ routeParams }) {
  const product = await api.getProductById(routeParams.id);
  if (!product) return `<div class="container page-section"><h1>Producto no encontrado</h1><a href="#/tienda" class="btn-primary">Volver</a></div>`;

  const related = await api.getRelated(product);
  const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));

  return {
    html: `
      <section class="page-section">
        <div class="container">
          <nav class="breadcrumb">
            <a href="#/">Inicio</a> / <a href="#/tienda">Tienda</a> / <span>${escapeHTML(product.name)}</span>
          </nav>

          <div class="product-detail">
            <div class="detail-img">
              <img src="${product.img}" alt="${escapeHTML(product.name)}">
            </div>
            <div class="detail-info">
              ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
              <h1>${escapeHTML(product.name)}</h1>
              <p class="rating-lg">${stars} <small>(${product.rating} / 5)</small></p>
              <p class="detail-price">${formatPrice(product.price)}</p>
              <p class="detail-desc">${escapeHTML(product.desc)}</p>

              <div class="detail-stock">
                <i class="fa-solid ${product.stock > 5 ? "fa-circle-check" : "fa-triangle-exclamation"}"></i>
                ${product.stock > 5 ? `${product.stock} disponibles` : `¡Solo ${product.stock} disponibles!`}
              </div>

              <div class="detail-qty">
                <label>Cantidad:</label>
                <div class="qty-control">
                  <button id="qDec">−</button>
                  <span id="qVal">1</span>
                  <button id="qInc">+</button>
                </div>
              </div>

              <button class="btn-primary btn-lg" id="addToCartBtn">
                <i class="fa-solid fa-bag-shopping"></i> Agregar al carrito
              </button>
            </div>
          </div>

          ${related.length ? `
            <div class="related-section">
              <h2>También te puede gustar</h2>
              <div class="product-grid">
                ${related.map(p => productCard(p)).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      </section>
    `,
    cleanup: null
  };
}

export function bindProduct() {
  bindProductCardEvents();
  let qty = 1;

  const qVal = document.getElementById("qVal");
  const dec = document.getElementById("qDec");
  const inc = document.getElementById("qInc");
  const addBtn = document.getElementById("addToCartBtn");

  if (!addBtn) return;

  dec.addEventListener("click", () => { qty = Math.max(1, qty - 1); qVal.textContent = qty; });
  inc.addEventListener("click", () => { qty += 1; qVal.textContent = qty; });

  addBtn.addEventListener("click", async () => {
    const id = Number(location.hash.split("/").pop());
    const p = await api.getProductById(id);
    for (let i = 0; i < qty; i++) cart.add(p);
    toast.show(`${p.name} × ${qty} agregado(s) 🛒`, "success");
  });
}
import { store } from "../store.js";
import { cart } from "../cart.js";
import { formatPrice, escapeHTML } from "../utils.js";
import { toast } from "./toast.js";

export function renderCartDrawer() {
  const root = document.getElementById("cart-root");

  const update = () => {
    const items = store.get("cart");
    const t = cart.totals();
    root.innerHTML = `
      <div class="overlay ${root.dataset.open === "1" ? "active" : ""}" id="cartOverlay"></div>
      <aside class="cart-panel ${root.dataset.open === "1" ? "open" : ""}" role="dialog" aria-label="Carrito">
        <div class="cart-header">
          <h3><i class="fa-solid fa-bag-shopping"></i> Tu Carrito (${cart.count()})</h3>
          <button id="cartClose" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="cart-items">
          ${items.length === 0 ? `<div class="cart-empty"><i class="fa-solid fa-mug-saucer"></i><p>Tu carrito está vacío</p><a href="#/tienda" class="btn-primary" id="goShop">Ir a la tienda</a></div>` :
            items.map(i => `
              <div class="cart-item">
                <img src="${i.img}" alt="${escapeHTML(i.name)}" />
                <div class="cart-item-info">
                  <h4>${escapeHTML(i.name)}</h4>
                  <p>${formatPrice(i.price)}</p>
                  <div class="cart-item-qty">
                    <button data-qty="dec" data-id="${i.id}">−</button>
                    <span>${i.qty}</span>
                    <button data-qty="inc" data-id="${i.id}">+</button>
                  </div>
                </div>
                <button class="remove-item" data-remove="${i.id}" aria-label="Eliminar">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            `).join("")}
        </div>

        ${items.length > 0 ? `
          <div class="cart-footer">
            ${t.coupon ? `<div class="coupon-applied"><span>${t.coupon.code}: ${t.coupon.label}</span><button id="removeCoupon">✕</button></div>` : ""}
            <div class="cart-summary">
              <div><span>Subtotal</span><span>${formatPrice(t.subtotal)}</span></div>
              ${t.discount ? `<div class="discount"><span>Descuento</span><span>-${formatPrice(t.discount)}</span></div>` : ""}
              <div><span>IVA (19%)</span><span>${formatPrice(t.tax)}</span></div>
              <div><span>Envío</span><span>${t.shipping === 0 ? "Gratis" : formatPrice(t.shipping)}</span></div>
            </div>
            <div class="cart-total"><span>Total:</span><strong>${formatPrice(t.total)}</strong></div>
            <a href="#/checkout" class="btn-checkout" id="checkoutLink">Ir a pagar</a>
          </div>
        ` : ""}
      </aside>
    `;

    root.querySelector("#cartClose").addEventListener("click", close);
    root.querySelector("#cartOverlay").addEventListener("click", close);
    root.querySelector("#goShop")?.addEventListener("click", close);
    root.querySelector("#checkoutLink")?.addEventListener("click", close);
    root.querySelector("#removeCoupon")?.addEventListener("click", () => { cart.removeCoupon(); toast.show("Cupón eliminado"); });

    root.querySelectorAll("[data-qty]").forEach(b => b.addEventListener("click", () => {
      cart.changeQty(Number(b.dataset.id), b.dataset.qty === "inc" ? 1 : -1);
    }));
    root.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => {
      cart.remove(Number(b.dataset.remove));
      toast.show("Producto eliminado");
    }));
  };

  const open = () => { root.dataset.open = "1"; update(); };
  const close = () => { root.dataset.open = "0"; update(); };

  update();
  store.on("cart", update);
  document.addEventListener("cart:open", open);
}
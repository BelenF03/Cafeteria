import { cart } from "../cart.js";
import { auth } from "../auth.js";
import { api } from "../api.js";
import { store } from "../store.js";
import { formatPrice, validators, uid } from "../utils.js";
import { toast } from "../components/toast.js";
import { router } from "../router.js";

export async function checkoutView() {
  if (cart.count() === 0) {
    return `<div class="container page-section empty-state"><i class="fa-solid fa-bag-shopping"></i><h1>Tu carrito está vacío</h1><a href="#/tienda" class="btn-primary">Ir a la tienda</a></div>`;
  }
  const t = cart.totals();
  const user = auth.current;

  return {
    html: `
      <section class="page-section">
        <div class="container">
          <div class="page-header">
            <span class="tagline">— Finalizar compra —</span>
            <h1>Checkout</h1>
          </div>

          <div class="checkout-grid">
            <div class="checkout-form-wrap">
              <form id="checkoutForm" novalidate>
                <h2>Datos de envío</h2>
                <div class="form-group">
                  <label>Nombre completo</label>
                  <input type="text" name="name" value="${user?.name || ""}" required>
                  <small class="err" data-err="name"></small>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value="${user?.email || ""}" required>
                  <small class="err" data-err="email"></small>
                </div>
                <div class="form-group">
                  <label>Teléfono</label>
                  <input type="tel" name="phone" required>
                  <small class="err" data-err="phone"></small>
                </div>
                <div class="form-group">
                  <label>Dirección</label>
                  <input type="text" name="address" required>
                  <small class="err" data-err="address"></small>
                </div>

                <h2>Método de pago</h2>
                <div class="payment-methods">
                  <label class="pay-option">
                    <input type="radio" name="method" value="card" checked>
                    <span><i class="fa-solid fa-credit-card"></i> Tarjeta</span>
                  </label>
                  <label class="pay-option">
                    <input type="radio" name="method" value="pse">
                    <span><i class="fa-solid fa-building-columns"></i> PSE</span>
                  </label>
                  <label class="pay-option">
                    <input type="radio" name="method" value="cash">
                    <span><i class="fa-solid fa-money-bill"></i> Efectivo</span>
                  </label>
                </div>

                <div class="coupon-box">
                  <input type="text" id="couponInput" placeholder="Código de cupón (CAFE10)">
                  <button type="button" id="applyCouponBtn">Aplicar</button>
                </div>

                <button type="submit" class="btn-primary btn-lg" id="payBtn">Pagar ${formatPrice(t.total)}</button>
              </form>
            </div>

            <aside class="checkout-summary">
              <h2>Resumen</h2>
              ${store.get("cart").map(i => `
                <div class="summary-item">
                  <img src="${i.img}" alt="">
                  <div><strong>${i.name}</strong><small>×${i.qty}</small></div>
                  <span>${formatPrice(i.price * i.qty)}</span>
                </div>
              `).join("")}
              <div class="summary-totals">
                <div><span>Subtotal</span><span>${formatPrice(t.subtotal)}</span></div>
                ${t.discount ? `<div class="discount"><span>Descuento</span><span>-${formatPrice(t.discount)}</span></div>` : ""}
                <div><span>IVA</span><span>${formatPrice(t.tax)}</span></div>
                <div><span>Envío</span><span>${t.shipping === 0 ? "Gratis" : formatPrice(t.shipping)}</span></div>
                <div class="summary-total"><span>Total</span><strong>${formatPrice(t.total)}</strong></div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    `,
    cleanup: null
  };
}

export function bindCheckout() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  document.getElementById("applyCouponBtn")?.addEventListener("click", () => {
    const code = document.getElementById("couponInput").value.trim();
    if (!code) return;
    const res = cart.applyCoupon(code);
    if (res.ok) { toast.show("Cupón aplicado 🎉", "success"); router.navigate("/checkout"); router.resolve(); }
    else toast.show(res.reason, "error");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let valid = true;
    const errs = {};

    if (!validators.required(data.name) || !validators.minLength(data.name, 3)) { errs.name = "Nombre requerido (mín. 3)"; valid = false; }
    if (!validators.email(data.email)) { errs.email = "Email inválido"; valid = false; }
    if (!validators.phone(data.phone)) { errs.phone = "Teléfono inválido"; valid = false; }
    if (!validators.required(data.address) || !validators.minLength(data.address, 5)) { errs.address = "Dirección requerida"; valid = false; }

    form.querySelectorAll(".err").forEach(el => el.textContent = "");
    Object.entries(errs).forEach(([k, v]) => {
      const el = form.querySelector(`[data-err="${k}"]`);
      if (el) el.textContent = v;
    });

    if (!valid) return;

    const btn = document.getElementById("payBtn");
    btn.disabled = true;
    btn.textContent = "Procesando...";

    try {
      const t = cart.totals();
      const payment = await api.processPayment({ amount: t.total, method: data.method });
      if (payment.success) {
        const order = {
          id: payment.orderId,
          date: new Date().toISOString(),
          items: store.get("cart"),
          totals: t,
          shipping: { name: data.name, email: data.email, phone: data.phone, address: data.address },
          method: data.method
        };
        const orders = [...store.get("orders"), order];
        store.set("orders", orders);
        cart.clear();

        document.getElementById("app").innerHTML = `
          <section class="page-section">
            <div class="container success-page">
              <i class="fa-solid fa-circle-check success-icon"></i>
              <h1>¡Gracias por tu compra!</h1>
              <p>Pedido <strong>#${order.id}</strong> confirmado</p>
              <p>Total: <strong>${formatPrice(order.totals.total)}</strong></p>
              <div class="success-actions">
                <a href="#/pedidos" class="btn-primary">Ver mis pedidos</a>
                <a href="#/tienda" class="btn-outline">Seguir comprando</a>
              </div>
            </div>
          </section>
        `;
        toast.show("¡Pago exitoso! 🎉", "success");
      }
    } catch (err) {
      toast.show("Error al procesar el pago", "error");
      btn.disabled = false;
      btn.textContent = "Reintentar pago";
    }
  });
}
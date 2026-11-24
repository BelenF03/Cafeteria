import { store } from "../store.js";
import { formatPrice } from "../utils.js";

export async function ordersView() {
  const orders = store.get("orders");
  return {
    html: `
      <section class="page-section">
        <div class="container">
          <div class="page-header">
            <span class="tagline">— Historial —</span>
            <h1>Mis pedidos</h1>
          </div>
          ${orders.length === 0 ? `<div class="empty-state"><i class="fa-solid fa-box-open"></i><p>Aún no has realizado pedidos.</p><a href="#/tienda" class="btn-primary">Explorar tienda</a></div>` :
            orders.slice().reverse().map(o => `
              <div class="order-card">
                <div class="order-head">
                  <div>
                    <strong>#${o.id}</strong>
                    <small>${new Date(o.date).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</small>
                  </div>
                  <span class="order-status"><i class="fa-solid fa-check"></i> Confirmado</span>
                </div>
                <div class="order-items">
                  ${o.items.map(i => `
                    <div class="order-item">
                      <img src="${i.img}" alt="">
                      <div><strong>${i.name}</strong><small>×${i.qty}</small></div>
                      <span>${formatPrice(i.price * i.qty)}</span>
                    </div>
                  `).join("")}
                </div>
                <div class="order-total">
                  <span>Total pagado</span>
                  <strong>${formatPrice(o.totals.total)}</strong>
                </div>
              </div>
            `).join("")}
        </div>
      </section>
    `,
    cleanup: null
  };
}
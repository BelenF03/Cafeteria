import { store } from "../store.js";
import { cart } from "../cart.js";
import { auth } from "../auth.js";
import { escapeHTML } from "../utils.js";

export function renderNavbar() {
  const root = document.getElementById("navbar-root");
  const update = () => {
    const count = cart.count();
    const user = auth.current;
    root.innerHTML = `
      <nav class="nav container">
        <a href="#/" class="logo">
          <i class="fa-solid fa-mug-hot"></i>
          <span>Aroma <em>&</em> Grano</span>
        </a>
        <ul class="nav-links">
          <li><a href="#/">Inicio</a></li>
          <li><a href="#/tienda">Tienda</a></li>
          <li><a href="#/pedidos">Pedidos</a></li>
          <li><a href="#/cuenta">${user ? escapeHTML(user.name) : "Cuenta"}</a></li>
        </ul>
        <div class="nav-actions">
          <a href="#/tienda" class="icon-btn" title="Buscar"><i class="fa-solid fa-magnifying-glass"></i></a>
          <button class="icon-btn2" id="cartBtn" title="Carrito">
            <i class="fa-solid fa-bag-shopping"></i>
            ${count > 0 ? `<span class="cart-count">${count > 99 ? "99+" : count}</span>` : ""}
          </button>
        </div>
      </nav>
    `;
    root.querySelector("#cartBtn").addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("cart:open"));
    });
  };

  update();
  store.on("cart", update);
  store.on("user", update);
}
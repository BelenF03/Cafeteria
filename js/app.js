import { router } from "./router.js";
import { renderNavbar } from "./components/navbar.js";
import { renderCartDrawer } from "./components/cartDrawer.js";

import { homeView } from "./views/home.js";
import { shopView, bindShop } from "./views/shop.js";
import { productView, bindProduct } from "./views/product.js";
import { checkoutView, bindCheckout } from "./views/checkout.js";
import { ordersView } from "./views/orders.js";
import { accountView, bindAccount } from "./views/account.js";

// Render global (navbar + drawer)
renderNavbar();
renderCartDrawer();

// Registrar rutas
router.register("/", homeView);
router.register("/tienda", async (ctx) => {
  const r = await shopView(ctx);
  setTimeout(bindShop, 0);
  return r;
});
router.register("/producto/:id", async (ctx) => {
  const r = await productView(ctx);
  setTimeout(bindProduct, 0);
  return r;
});
router.register("/checkout", async (ctx) => {
  const r = await checkoutView(ctx);
  setTimeout(bindCheckout, 0);
  return r;
});
router.register("/pedidos", ordersView);
router.register("/cuenta", async (ctx) => {
  const r = await accountView(ctx);
  setTimeout(bindAccount, 0);
  return r;
});

// 404
router.setNotFound(() => `
  <section class="page-section">
    <div class="container empty-state">
      <i class="fa-solid fa-mug-saucer" style="font-size:4rem;color:var(--brown-light)"></i>
      <h1>Página no encontrada</h1>
      <a href="#/" class="btn-primary">Volver al inicio</a>
    </div>
  </section>
`);

router.init();
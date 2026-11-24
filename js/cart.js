import { store } from "./store.js";
import { CONFIG } from "./config.js";

export const cart = {
  add(product) {
    const items = [...store.get("cart")];
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) return { ok: false, reason: "stock" };
      existing.qty += 1;
    } else {
      items.push({ id: product.id, name: product.name, price: product.price, img: product.img, stock: product.stock, qty: 1 });
    }
    store.set("cart", items);
    return { ok: true };
  },

  remove(id) {
    store.set("cart", store.get("cart").filter(i => i.id !== id));
  },

  changeQty(id, delta) {
    const items = store.get("cart").map(i => {
      if (i.id !== id) return i;
      const newQty = Math.max(0, Math.min(i.qty + delta, i.stock));
      return { ...i, qty: newQty };
    }).filter(i => i.qty > 0);
    store.set("cart", items);
  },

  clear() { store.set("cart", []); store.set("coupon", null); },

  count() { return store.get("cart").reduce((s, i) => s + i.qty, 0); },

  subtotal() { return store.get("cart").reduce((s, i) => s + i.price * i.qty, 0); },

  totals() {
    const subtotal = this.subtotal();
    const coupon = store.get("coupon");
    let discount = 0;
    let shipping = subtotal >= CONFIG.FREE_SHIPPING_MIN || subtotal === 0 ? 0 : CONFIG.SHIPPING_COST;

    if (coupon) {
      if (coupon.type === "percent") discount = Math.round(subtotal * coupon.value / 100);
      else if (coupon.type === "fixed") discount = Math.min(coupon.value, subtotal);
      else if (coupon.type === "shipping") shipping = 0;
    }

    const taxable = subtotal - discount;
    const tax = Math.round(taxable * CONFIG.TAX_RATE);
    const total = taxable + shipping + tax;

    return { subtotal, discount, shipping, tax, total, coupon };
  },

  applyCoupon(code) {
    const c = CONFIG.COUPONS[code.toUpperCase()];
    if (!c) return { ok: false, reason: "Cupón inválido" };
    store.set("coupon", { code: code.toUpperCase(), ...c });
    return { ok: true };
  },

  removeCoupon() { store.set("coupon", null); }
};
// Configuración global de la aplicación
export const CONFIG = {
  APP_NAME: "Aroma & Grano",
  CURRENCY: "COP",
  LOCALE: "es-CO",
  TAX_RATE: 0.19,             // IVA 19%
  SHIPPING_COST: 8000,        // Envío estándar
  FREE_SHIPPING_MIN: 80000,   // Envío gratis desde
  ITEMS_PER_PAGE: 6,
  STORAGE_KEYS: {
    CART: "ag_cart",
    FAVS: "ag_favs",
    USER: "ag_user",
    ORDERS: "ag_orders",
    COUPON: "ag_coupon"
  },
  COUPONS: {
    "CAFE10": { type: "percent", value: 10, label: "10% off" },
    "BIENVENIDO": { type: "fixed", value: 15000, label: "$15.000 off" },
    "ENVIOGRATIS": { type: "shipping", value: 0, label: "Envío gratis" }
  }
};
// Store ligero con patrón pub/sub
import { storage } from "./utils.js";
import { CONFIG } from "./config.js";

const listeners = new Map();

const state = {
  cart: storage.get(CONFIG.STORAGE_KEYS.CART, []),
  favorites: storage.get(CONFIG.STORAGE_KEYS.FAVS, []),
  user: storage.get(CONFIG.STORAGE_KEYS.USER, null),
  orders: storage.get(CONFIG.STORAGE_KEYS.ORDERS, []),
  coupon: storage.get(CONFIG.STORAGE_KEYS.COUPON, null)
};

function persist(key) {
  const map = {
    cart: CONFIG.STORAGE_KEYS.CART,
    favorites: CONFIG.STORAGE_KEYS.FAVS,
    user: CONFIG.STORAGE_KEYS.USER,
    orders: CONFIG.STORAGE_KEYS.ORDERS,
    coupon: CONFIG.STORAGE_KEYS.COUPON
  };
  if (map[key]) storage.set(map[key], state[key]);
}

export const store = {
  get(key) { return state[key]; },

  set(key, value) {
    state[key] = value;
    persist(key);
    emit(key, value);
    emit("*", { key, value });
  },

  on(event, cb) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(cb);
    return () => listeners.get(event).delete(cb);
  },

  reset() {
    state.cart = [];
    state.favorites = [];
    state.user = null;
    state.orders = [];
    state.coupon = null;
    Object.keys(state).forEach(persist);
    emit("*");
  }
};

function emit(event, payload) {
  listeners.get(event)?.forEach(cb => cb(payload));
}

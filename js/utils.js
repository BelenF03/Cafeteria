import { CONFIG } from "./config.js";

// Formato de moneda
export const formatPrice = (n) =>
  new Intl.NumberFormat(CONFIG.LOCALE, {
    style: "currency",
    currency: CONFIG.CURRENCY,
    maximumFractionDigits: 0
  }).format(n);

// Storage helpers
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); }
  },
  remove(key) { localStorage.removeItem(key); }
};

// Debounce
export const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

// Validaciones
export const validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v) => /^[0-9\s\-\+]{7,15}$/.test(v),
  required: (v) => v !== null && v !== undefined && String(v).trim().length > 0,
  minLength: (v, n) => String(v).trim().length >= n
};

// Escapar HTML (seguridad XSS básica)
export const escapeHTML = (str = "") =>
  String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

// ID único
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Delay simulado para API
export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Scroll to top
export const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
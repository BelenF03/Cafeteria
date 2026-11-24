import { store } from "./store.js";
import { delay } from "./utils.js";

export const auth = {
  isLoggedIn() { return !!store.get("user"); },

  get current() { return store.get("user"); },

  async login(email, password) {
    await delay(600);
    if (!email || password.length < 4) throw new Error("Credenciales inválidas");
    const user = { id: "u_" + Date.now(), name: email.split("@")[0], email };
    store.set("user", user);
    return user;
  },

  async register(name, email, password) {
    await delay(800);
    if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");
    const user = { id: "u_" + Date.now(), name, email };
    store.set("user", user);
    return user;
  },

  logout() { store.set("user", null); }
};
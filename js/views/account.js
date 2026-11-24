import { auth } from "../auth.js";
import { router } from "../router.js";
import { toast } from "../components/toast.js";

export async function accountView() {
  const user = auth.current;

  if (user) {
    return {
      html: `
        <section class="page-section">
          <div class="container">
            <div class="page-header"><span class="tagline">— Cuenta —</span><h1>Hola, ${user.name}</h1></div>
            <div class="account-card">
              <p><strong>Email:</strong> ${user.email}</p>
              <div class="account-actions">
                <a href="#/pedidos" class="btn-primary">Ver mis pedidos</a>
                <button id="logoutBtn" class="btn-outline">Cerrar sesión</button>
              </div>
            </div>
          </div>
        </section>
      `,
      cleanup: null
    };
  }

  return {
    html: `
      <section class="page-section">
        <div class="container">
          <div class="page-header"><span class="tagline">— Cuenta —</span><h1>Iniciar sesión / Registrarse</h1></div>
          <form id="authForm" class="auth-form">
            <div class="form-group">
              <label>Nombre (solo registro)</label>
              <input type="text" name="name" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" name="password" required minlength="6" />
            </div>
            <div class="auth-actions">
              <button type="submit" name="action" value="login" class="btn-primary">Iniciar sesión</button>
              <button type="submit" name="action" value="register" class="btn-outline">Registrarme</button>
            </div>
          </form>
        </div>
      </section>
    `,
    cleanup: null
  };
}

export function bindAccount() {
  const logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", () => {
    auth.logout();
    toast.show("Sesión cerrada");
    router.navigate("/cuenta");
    router.resolve();
  });

  const form = document.getElementById("authForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.submitter;
    const data = Object.fromEntries(new FormData(form));
    try {
      if (btn.value === "register") {
        if (!data.name) return toast.show("Nombre requerido", "error");
        await auth.register(data.name, data.email, data.password);
        toast.show("¡Bienvenido! 🎉", "success");
      } else {
        await auth.login(data.email, data.password);
        toast.show("Sesión iniciada", "success");
      }
      router.navigate("/cuenta");
      router.resolve();
    } catch (err) { toast.show(err.message, "error"); }
  });
}
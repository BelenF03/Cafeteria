// Router SPA hash-based
const routes = new Map();
let notFound = () => "<p>404</p>";
let currentCleanup = null;

export const router = {
  register(path, handler) { routes.set(path, handler); },

  setNotFound(handler) { notFound = handler; },

  navigate(path) {
    if (location.hash === "#" + path) return;
    location.hash = path;
  },

  current() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const [pathPart, queryPart] = hash.split("?");
    const params = new URLSearchParams(queryPart || "");
    return { path: pathPart, params };
  },

  async resolve() {
    const { path, params } = this.current();

    // Coincidencia exacta o paramétrica tipo /producto/:id
    let handler = routes.get(path);
    let routeParams = {};

    if (!handler) {
      for (const [pattern, h] of routes) {
        const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "([^/]+)") + "$");
        const match = path.match(regex);
        if (match) {
          handler = h;
          const keys = [...pattern.matchAll(/:([^/]+)/g)].map(m => m[1]);
          keys.forEach((k, i) => routeParams[k] = match[i + 1]);
          break;
        }
      }
    }

    const root = document.getElementById("app");

    if (currentCleanup) { try { currentCleanup(); } catch {} currentCleanup = null; }

    if (!handler) {
      root.innerHTML = notFound();
      return;
    }

    root.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';

    try {
      const result = await handler({ params: Object.fromEntries(params), routeParams });
      if (typeof result === "string") root.innerHTML = result;
      else if (result && result.html) {
        root.innerHTML = result.html;
        currentCleanup = result.cleanup || null;
      }
    } catch (err) {
      console.error(err);
      root.innerHTML = `<div class="container"><p class="error">Error al cargar la vista.</p></div>`;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  },

  init() {
    window.addEventListener("hashchange", () => this.resolve());
    if (!location.hash) location.hash = "#/";
    this.resolve();
  }
};
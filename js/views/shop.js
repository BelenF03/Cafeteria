import { api } from "../api.js";
import { productCard, bindProductCardEvents } from "../components/productCard.js";
import { router } from "../router.js";
import { debounce } from "../utils.js";
import { CONFIG } from "../config.js";

export async function shopView({ params }) {
  const state = {
    category: params.cat || "all",
    search: params.q || "",
    sort: params.sort || "default",
    page: Number(params.page) || 1
  };

  const categories = api.getCategories();
  const data = await api.getProducts({
    category: state.category,
    search: state.search,
    sort: state.sort,
    page: state.page,
    perPage: CONFIG.ITEMS_PER_PAGE
  });

  const html = `
    <section class="page-section">
      <div class="container">
        <div class="page-header">
          <span class="tagline">— Tienda —</span>
          <h1>Nuestro Catálogo</h1>
        </div>

        <div class="shop-toolbar">
          <div class="filters">
            ${categories.map(c => `
              <button class="filter-btn ${state.category === c.slug ? "active" : ""}" data-cat="${c.slug}">${c.label}</button>
            `).join("")}
          </div>
          <div class="shop-controls">
            <input type="search" id="searchInput" placeholder="Buscar..." value="${state.search}" class="search-input"/>
            <select id="sortSelect" class="sort-select">
              <option value="default" ${state.sort === "default" ? "selected" : ""}>Relevancia</option>
              <option value="price-asc" ${state.sort === "price-asc" ? "selected" : ""}>Precio ↑</option>
              <option value="price-desc" ${state.sort === "price-desc" ? "selected" : ""}>Precio ↓</option>
              <option value="rating" ${state.sort === "rating" ? "selected" : ""}>Mejor puntuados</option>
              <option value="name" ${state.sort === "name" ? "selected" : ""}>A - Z</option>
            </select>
          </div>
        </div>

        <p class="results-count">${data.total} producto${data.total !== 1 ? "s" : ""} encontrado${data.total !== 1 ? "s" : ""}</p>

        <div class="product-grid">
          ${data.items.length ? data.items.map(p => productCard(p)).join("") : `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><p>No se encontraron productos.</p></div>`}
        </div>

        ${data.totalPages > 1 ? `
          <div class="pagination">
            <button ${data.page <= 1 ? "disabled" : ""} data-page="${data.page - 1}"><i class="fa-solid fa-chevron-left"></i></button>
            ${Array.from({ length: data.totalPages }, (_, i) => i + 1).map(n =>
              `<button class="${n === data.page ? "active" : ""}" data-page="${n}">${n}</button>`
            ).join("")}
            <button ${data.page >= data.totalPages ? "disabled" : ""} data-page="${data.page + 1}"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        ` : ""}
      </div>
    </section>
  `;

  return {
    html,
    cleanup: null,
    afterRender: () => {}
  };
}

export function bindShop() {
  bindProductCardEvents();

  const go = (patch) => {
    const { params } = router.current();
    const merged = new URLSearchParams({
      cat: params.get("cat") || "all",
      q: params.get("q") || "",
      sort: params.get("sort") || "default",
      page: params.get("page") || "1",
      ...patch
    });
    router.navigate(`/tienda?${merged.toString()}`);
  };

  document.querySelectorAll("[data-cat]").forEach(b =>
    b.addEventListener("click", () => go({ cat: b.dataset.cat, page: "1" }))
  );

  document.querySelector("#sortSelect")?.addEventListener("change", (e) => go({ sort: e.target.value, page: "1" }));

  const search = document.querySelector("#searchInput");
  if (search) {
    search.addEventListener("input", debounce((e) => go({ q: e.target.value, page: "1" }), 400));
  }

  document.querySelectorAll("[data-page]").forEach(b =>
    b.addEventListener("click", () => go({ page: b.dataset.page }))
  );
}
import { api } from "../api.js";
import { productCard, bindProductCardEvents } from "../components/productCard.js";

export async function homeView() {
  const { items } = await api.getProducts({ perPage: 4 });
  return {
    html: `
      <section class="hero">
        <div class="hero-content container">
          <div class="hero-text">
            <span class="tagline">— Café de especialidad —</span>
            <h1>El arte de un<br><span>buen café</span></h1>
            <p>Granos seleccionados, tostados artesanalmente y preparados con pasión.</p>
            <div class="hero-cta">
              <a href="#/tienda" class="btn-primary">Explorar Menú</a>
              <a href="#/tienda?cat=cafe" class="btn-outline">Ver Cafés</a>
            </div>
          </div>
          <div class="hero-img">
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800" alt="Café">
          </div>
        </div>
      </section>

      <section class="products">
        <div class="container">
          <div class="section-header">
            <span class="tagline">— Destacados —</span>
            <h2>Los favoritos de la casa</h2>
            <p>Selección de nuestros productos más pedidos</p>
          </div>
          <div class="product-grid">
            ${items.map(p => productCard(p)).join("")}
          </div>
          <div class="center-cta"><a href="#/tienda" class="btn-primary">Ver toda la tienda</a></div>
        </div>
      </section>

      <section class="about">
        <div class="container about-grid">
          <div class="about-img">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700" alt="Nosotros">
          </div>
          <div class="about-text">
            <span class="tagline">— Nuestra Historia —</span>
            <h2>Pasión por el café<br>desde 2015</h2>
            <p>Trabajamos directamente con caficultores colombianos para traer a tu mesa los mejores granos, tostados en pequeños lotes.</p>
            <div class="features">
              <div class="feature"><i class="fa-solid fa-seedling"></i><span>100% Orgánico</span></div>
              <div class="feature"><i class="fa-solid fa-truck-fast"></i><span>Envío Rápido</span></div>
              <div class="feature"><i class="fa-solid fa-award"></i><span>Calidad Premium</span></div>
            </div>
          </div>
        </div>
      </section>
    `,
    cleanup: null
  };
}

export function bindHome() { bindProductCardEvents(); }
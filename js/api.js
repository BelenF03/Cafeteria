// "Backend" simulado con datos locales y latencia
import { delay } from "./utils.js";

const PRODUCTS = [
  { id: 1, name: "Café Colombiano 500g", desc: "Grano tostado medio, notas a chocolate y caramelo.", price: 32000, category: "cafe", badge: "Popular", stock: 24, rating: 4.8, img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600" },
  { id: 2, name: "Café Espresso 250g", desc: "Tueste oscuro ideal para espresso intenso.", price: 22000, category: "cafe", stock: 40, rating: 4.6, img: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600" },
  { id: 3, name: "Cold Brew Artesanal", desc: "Extracción en frío durante 18 horas. Suave y refrescante.", price: 18000, category: "cafe", badge: "Nuevo", stock: 15, rating: 4.9, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600" },
  { id: 4, name: "Prensa Francesa 600ml", desc: "Vidrio borosilicato resistente. Diseño elegante.", price: 45000, category: "accesorios", stock: 12, rating: 4.7, img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600" },
  { id: 5, name: "Taza Cerámica Artesanal", desc: "Hecha a mano, diseño minimalista.", price: 28000, category: "accesorios", stock: 30, rating: 4.5, img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600" },
  { id: 6, name: "Molino Manual Premium", desc: "Molienda ajustable en acero inoxidable.", price: 85000, category: "accesorios", badge: "Premium", stock: 8, rating: 4.9, img: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600" },
  { id: 7, name: "Croissant de Mantequilla", desc: "Recién horneado cada mañana.", price: 8500, category: "reposteria", stock: 20, rating: 4.7, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600" },
  { id: 8, name: "Brownie de Chocolate", desc: "Con nueces y chocolate 70% cacao.", price: 9500, category: "reposteria", badge: "Favorito", stock: 25, rating: 4.8, img: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600" },
  { id: 9, name: "Cheesecake de Café", desc: "Base de galleta y crema suave con café.", price: 12000, category: "reposteria", stock: 10, rating: 4.6, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600" },
  { id: 10, name: "Kit Barista Inicial", desc: "Prensa + molino + café 250g. Todo para empezar.", price: 120000, category: "accesorios", badge: "Combo", stock: 5, rating: 5.0, img: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600" },
  { id: 11, name: "Latte de Vainilla", desc: "Café + leche vaporizada + vainilla natural.", price: 11000, category: "cafe", stock: 50, rating: 4.7, img: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600" },
  { id: 12, name: "Muffin de Arándanos", desc: "Esponjoso con arándanos frescos.", price: 8000, category: "reposteria", stock: 18, rating: 4.4, img: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600" },
  { id: 13, name: "Café Geisha 250g", desc: "Edición limitada. Notas florales y cítricas.", price: 95000, category: "cafe", badge: "Edición limitada", stock: 3, rating: 5.0, img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600" },
  { id: 14, name: "Termo Acero 350ml", desc: "Mantiene la temperatura 12h. Acero inoxidable.", price: 62000, category: "accesorios", stock: 22, rating: 4.6, img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600" },
  { id: 15, name: "Alfajor de Café", desc: "Relleno de dulce de leche y toque de café.", price: 6500, category: "reposteria", stock: 35, rating: 4.5, img: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=600" },
  { id: 16, name: "Sifón de Café", desc: "Método de extracción por vacío. Elegante.", price: 155000, category: "accesorios", stock: 4, rating: 4.9, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600" }
];

const CATEGORIES = [
  { slug: "all", label: "Todos" },
  { slug: "cafe", label: "Café" },
  { slug: "accesorios", label: "Accesorios" },
  { slug: "reposteria", label: "Repostería" }
];

export const api = {
  async getProducts({ category = "all", search = "", sort = "default", page = 1, perPage = 6 } = {}) {
    await delay(300);
    let list = [...PRODUCTS];

    if (category !== "all") list = list.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    const total = list.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const items = list.slice(start, start + perPage);

    return { items, total, totalPages, page, perPage };
  },

  async getProductById(id) {
    await delay(250);
    return PRODUCTS.find(p => p.id === Number(id)) || null;
  },

  async getRelated(product, limit = 4) {
    await delay(200);
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);
  },

  getCategories() { return CATEGORIES; },

  async processPayment(payload) {
    await delay(900);
    // Simula éxito siempre (podrías fallar aleatoriamente)
    return {
      success: true,
      orderId: "ORD-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
      amount: payload.amount,
      method: payload.method
    };
  }
};
# ☕ Aroma & Grano - E-commerce de Cafetería

Aroma & Grano es una aplicación web tipo Single Page Application (SPA) diseñada para una cafetería de especialidad. Permite a los usuarios explorar un catálogo de productos, buscar, filtrar, gestionar un carrito de compras y simular el proceso de checkout de manera fluida y profesional.

## ✨ Características principales
* **Catálogo Dinámico:** Filtros por categoría, búsqueda en tiempo real y ordenamiento por precio/calificación.
* **Carrito de Compras:** Panel lateral con control de cantidades, cálculo de subtotal, IVA y envío.
* **Persistencia de Datos:** El carrito, los favoritos y el historial de pedidos se guardan localmente (LocalStorage).
* **Checkout Simulado:** Formulario de envío con validaciones, aplicación de cupones de descuento y pasarela de pago falsa.
* **Diseño UI/UX:** Interfaz minimalista y estética, predominando el color blanco con detalles en marrón café. Totalmente responsivo.

## 🛠️ Tecnologías utilizadas
* HTML5 semántico
* CSS3 (Variables, Flexbox, CSS Grid, Animaciones)
* Vanilla JavaScript (Arquitectura basada en módulos ES6, patrón de estado Pub/Sub, enrutamiento SPA)

## 🚀 Cómo ejecutar el proyecto localmente
Debido a que el proyecto utiliza módulos de JavaScript (ES Modules), es necesario ejecutarlo a través de un servidor local.
1. Clona el repositorio.
2. Abre la carpeta en tu editor de código (ej. VS Code).
3. Ejecuta la extensión **Live Server** (Ritwick Dey) o usa `python -m http.server 8080` en la terminal.
4. Abre `http://localhost:8080` en tu navegador.

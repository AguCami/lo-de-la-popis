// ============================================================
//  CONFIGURACIÓN DEL LOCAL — editá este archivo para cambiar
//  nombre, WhatsApp, costo de envío y el menú.
// ============================================================

window.CONFIG = {
  nombre: "Lo de la Popi's",
  slogan: "Comida casera directo a tu casa",

  // Número de WhatsApp que recibe los pedidos (formato internacional, sin + ni espacios)
  // Ej. Argentina: 549 + código de área sin 0 + número sin 15 → "5491112345678"
  whatsapp: "5491100000000",

  moneda: "$",
  costoEnvio: 1500,
  pedidoMinimo: 0,
  horario: "Mar a Dom · 19:30 a 23:30",

  // Archivos en la carpeta /assets
  video: "assets/intro.mp4",
  logo: "assets/logo.jpg",

  mediosDePago: ["Efectivo", "Transferencia", "Mercado Pago"],
};

// Menú de ejemplo — reemplazalo por los productos reales.
// "imagen" es opcional: si no hay, se muestra el emoji.
window.MENU = [
  {
    categoria: "Empanadas",
    productos: [
      { id: "emp-carne", nombre: "Empanada de carne", descripcion: "Cortada a cuchillo, al horno.", precio: 1200, emoji: "🥟" },
      { id: "emp-jyq", nombre: "Empanada de jamón y queso", descripcion: "Clásica, al horno.", precio: 1100, emoji: "🥟" },
      { id: "emp-docena", nombre: "Docena surtida", descripcion: "12 empanadas a elección (indicalo en notas).", precio: 12500, emoji: "🧺" },
    ],
  },
  {
    categoria: "Pizzas",
    productos: [
      { id: "pz-muzza", nombre: "Muzzarella", descripcion: "Salsa de tomate, muzzarella y aceitunas.", precio: 8500, emoji: "🍕" },
      { id: "pz-napo", nombre: "Napolitana", descripcion: "Muzzarella, tomate en rodajas y ajo.", precio: 9500, emoji: "🍕" },
    ],
  },
  {
    categoria: "Minutas",
    productos: [
      { id: "mil-napo", nombre: "Milanesa napolitana con papas", descripcion: "De ternera, con papas fritas.", precio: 11000, emoji: "🍽️" },
      { id: "hamb", nombre: "Hamburguesa completa", descripcion: "Lechuga, tomate, queso, huevo y papas.", precio: 9800, emoji: "🍔" },
    ],
  },
  {
    categoria: "Postres",
    productos: [
      { id: "flan", nombre: "Flan casero", descripcion: "Con dulce de leche o crema.", precio: 3500, emoji: "🍮" },
    ],
  },
  {
    categoria: "Bebidas",
    productos: [
      { id: "gaseosa", nombre: "Gaseosa 1,5 L", descripcion: "Coca-Cola, Sprite o Fanta.", precio: 3000, emoji: "🥤" },
      { id: "agua", nombre: "Agua 500 ml", descripcion: "Con o sin gas.", precio: 1200, emoji: "💧" },
    ],
  },
];

// =========================================================
//  NEGOCIO.JS — ÚNICO archivo que se edita por cliente
//  (además de las fotos y el logo en assets/).
//
//  Trae como ejemplo los datos de Soda La Casita.
//  Después de editar:  node build.mjs   → genera dist/
//  Vista previa local: npx serve dist
// =========================================================

export const NEGOCIO = {
  id: "lacasita",                 // corto, sin espacios: prefijo para datos del navegador y respaldos
  nombre: "Soda La Casita",       // nombre completo
  nombreCorto: "La Casita",       // como lo dice la gente
  lema: "Desde 1970",
  fundado: 1970,                  // año; se usa para "años de sabor". null si no aplica
  soporte: "ISCR Tech (iscrtech.com)",

  // SEO y vista previa al compartir en WhatsApp/Facebook
  seo: {
    titulo: "Soda La Casita | San Rafael de Oreamuno · Menú",
    descripcion: "Soda La Casita, desde 1970 en San Rafael de Oreamuno, Cartago. Lápices, hamburguesas, empanadas, tacos, gallos y más. Mirá el menú y hacé tu pedido.",
    ogTitulo: "Soda La Casita · Desde 1970",
    ogDescripcion: "Lápices, hamburguesas, empanadas, tacos y gallos en San Rafael de Oreamuno, Cartago.",
    ogImagen: "img/fachada.jpg"
  },

  // Colores de marca (hex). El resto de tonos se calcula solo.
  colores: {
    primario: "#2F7D57",
    primarioOsc: "#24654A",
    acento: "#E8833A",
    acentoOsc: "#CF6B22"
  },

  hero: {
    etiqueta: "🏠 Desde 1970 · San Rafael de Oreamuno",
    tituloScript: "El sabor de siempre,",
    titulo: "en tu casita.",
    texto: "Lápices, hamburguesas, empanadas, tacos, gallos y antojos hechos al momento, a precios de soda. Del cementerio de San Rafael, 150 metros este.",
    imagen: "img/fachada-cuadrada.jpg",
    imagenAlt: "Fachada de Soda La Casita",
    badges: [["🌭", "Lápiz desde ₡2.300"], ["🍔", "Hamburguesas desde ₡2.100"]]
  },

  historia: {
    script: "Nuestra historia",
    titulo: "Más de 50 años dándole sabor a San Rafael.",
    parrafos: [
      "Desde 1970, La Casita es la soda de confianza de San Rafael de Oreamuno: el lugar para un lápiz, una empanada o unos tacos a buen precio, con la atención cercana de siempre.",
      "Hoy nos encontrás en nuestro local renovado, con el mismo sabor que nos ha acompañado por generaciones. Ordená en la caja, retirá y disfrutá."
    ],
    imagenes: [["img/fachada.jpg", "Local de Soda La Casita de día"], ["img/rotulo-noche.jpg", "Rótulo de La Casita de noche"]],
    // [valor, etiqueta]. Usá "{anios}" como valor para calcular los años desde `fundado`.
    stats: [["1970", "Abrimos"], ["{anios}", "Años de sabor"], ["100%", "Hecho al momento"]]
  },

  cta: { titulo: "¿Se te antojó? 🌭", texto: "Hacé tu pedido y pasá a recogerlo." }
};

// Partes del sitio que se activan o no para este cliente
export const MODULOS = {
  tarjeta: true      // tarjeta de sellos + panel del personal (requiere Firebase/Firestore)
};

export const CONFIG = {
  // WhatsApp con código 506, sin espacios ni +. Ej: "50688887777".
  // Si se deja vacío (""), los botones llaman por teléfono (el carrito necesita WhatsApp).
  whatsapp: "50688807252",
  telefonos: ["2551-1110", "2553-4059"],
  tiempoPrep: "20–30 min",       // se muestra en el menú y en el carrito
  retiroOpciones: [30, 45, 60],  // botones "En X min"
  retiroMinimo: 30,              // minutos mínimos si elige una hora exacta
  direccion: "Del cementerio de San Rafael, 150 metros este. San Rafael de Oreamuno, Cartago, Costa Rica.",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Soda+La+Casita+San+Rafael+Oreamuno+Cartago",
  mapaEmbed: "https://www.google.com/maps?q=Soda+La+Casita,+San+Rafael,+Oreamuno,+Cartago,+Costa+Rica&output=embed",
  horario: [
    ["Lunes a domingo", "Por confirmar"]   // PENDIENTE: horario real
  ],
  pagos: ["💵 Efectivo", "📱 SINPE Móvil", "💳 Tarjeta"]
};

/* =========================================================
   MENÚ — pestañas → secciones → platos
   precio: texto tal cual se muestra
   extra: variante opcional "Etiqueta ₡precio" (ej. "Con papas ₡2.800") → agrega botón "+ Con papas"
   desc: descripción opcional · sinPedido: true → se muestra pero no se agrega al carrito
   ========================================================= */
export const MENU = {
  "Lápices y hamburguesas": [
    { titulo: "Lápiz", ico: "🌭", platos: [
      { nombre: "Lápiz Corriente", precio: "₡2.300", extra: "Con papas ₡2.800" },
      { nombre: "Lápiz Especial",  precio: "₡2.500", extra: "Con papas ₡3.000" }
    ]},
    { titulo: "Hamburguesas", ico: "🍔", platos: [
      { nombre: "Hamburguesa Corriente", precio: "₡2.100", extra: "Con papas ₡2.600" },
      { nombre: "Hamburguesa Especial",  precio: "₡2.300", extra: "Con papas ₡2.800" }
    ]}
  ],
  "Empanadas y tacos": [
    { titulo: "Empanadas", ico: "🥟", platos: [
      { nombre: "Carne", precio: "₡2.200" },
      { nombre: "Pollo", precio: "₡2.200" },
      { nombre: "Queso", precio: "₡2.200" },
      { nombre: "Frijol", precio: "₡2.200" },
      { nombre: "Arreglada", precio: "₡2.400" }
    ]},
    { titulo: "Tacos", ico: "🌮", platos: [
      { nombre: "Taco", precio: "₡2.000" },
      { nombre: "Taco doble", precio: "₡2.200" },
      { nombre: "Súper Taco", precio: "₡2.300" },
      { nombre: "Súper Taco Doble", precio: "₡2.600" },
      { nombre: "Adicional de papas", precio: "₡700", sinPedido: true }
    ]}
  ],
  "Papas y gallos": [
    { titulo: "Papas", ico: "🍟", platos: [
      { nombre: "Papas a la Francesa", precio: "₡1.900" },
      { nombre: "Salchipapas", precio: "₡2.000" },
      { nombre: "Papa suprema", precio: "₡2.700" }
    ]},
    { titulo: "Gallos", ico: "🫓", platos: [
      { nombre: "Gallo de Carne", precio: "₡2.100" },
      { nombre: "Gallo de Salchichón", precio: "₡1.800" },
      { nombre: "Torta de Carne", precio: "₡1.800" }
    ]}
  ],
  "Otros": [
    { titulo: "Otros", ico: "🍌", platos: [
      { nombre: "Perro Caliente", precio: "₡1.600" },
      { nombre: "Perro Caliente con papas", precio: "₡2.200" },
      { nombre: "Burrito", precio: "₡2.300" },
      { nombre: "Burrito con papas", precio: "₡2.900" },
      { nombre: "Chalupa", precio: "₡2.400" },
      { nombre: "Nachos", precio: "₡2.800" },
      { nombre: "Patacones Supremos", precio: "₡2.800" },
      { nombre: "Enyucado", precio: "₡1.400" },
      { nombre: "Enyucado Arreglado", precio: "₡1.500" },
      { nombre: "Doraditas", precio: "₡1.800" },
      { nombre: "Plátano con Queso", precio: "₡1.900" }
    ]}
  ]
};

// =========================================================
//  TARJETA DE SELLOS (solo si MODULOS.tarjeta = true)
//  La meta se copia sola a firestore.rules al hacer build.
// =========================================================
export const LEALTAD = {
  meta: 10,                  // sellos para ganar el premio
  montoMinimo: 3000,         // compra mínima (₡) para sumar sello
  modo: "porCompra",         // "porCompra": 1 sello por compra ≥ mínimo · "porCada": 1 sello por cada ₡montoMinimo
  premio: "Lápiz corriente gratis"
};

// =========================================================
//  FIREBASE — un proyecto por cliente que use la tarjeta
//  (Configuración del proyecto → Tus apps → App web).
//  Estos datos NO son secretos: la seguridad la dan las reglas.
// =========================================================
export const FIREBASE = {
  config: {
    apiKey: "PEGAR_API_KEY",
    authDomain: "PEGAR.firebaseapp.com",
    projectId: "PEGAR",
    storageBucket: "PEGAR.firebasestorage.app",
    messagingSenderId: "PEGAR",
    appId: "PEGAR"
  },
  // Sitio de Hosting. Vacío = el sitio por defecto del proyecto (projectId.web.app).
  hostingSite: "",
  // Clave PÚBLICA de reCAPTCHA Enterprise para App Check. Vacío = sin App Check.
  appCheckSiteKey: ""
};

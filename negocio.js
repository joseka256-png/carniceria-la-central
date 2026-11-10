// =========================================================
//  NEGOCIO.JS — ÚNICO archivo que se edita por cliente
//  (además de las fotos y el logo en assets/).
//
//  Cliente: Carnicería La Central (Artigran S.A.).
//  Después de editar:  node build.mjs   → genera dist/
//  Vista previa local: npx serve dist
// =========================================================

export const NEGOCIO = {
  id: "lacentral",
  nombre: "Carnicería La Central",
  nombreCorto: "La Central",
  lema: "Más de 75 años a su servicio",
  fundado: null,                  // PENDIENTE: año de fundación (si lo dan, se calcula "años de servicio")
  soporte: "ISCR Tech (iscrtech.com)",

  seo: {
    titulo: "Carnicería La Central | Más de 75 años a su servicio",
    descripcion: "Carnicería La Central (Artigran S.A.): carne fresca de res, cerdo y pollo con más de 75 años de experiencia. Hacé tu pedido por WhatsApp y sumá sellos con tu tarjeta de cliente frecuente.",
    ogTitulo: "Carnicería La Central · Más de 75 años a su servicio",
    ogDescripcion: "Carne fresca de confianza. Pedidos por WhatsApp y tarjeta de cliente frecuente.",
    ogImagen: "img/portada-temporal.jpg"
  },

  // Tomados del logo
  colores: {
    primario: "#1C2970",
    primarioOsc: "#131D52",
    acento: "#C62828",
    acentoOsc: "#A11F1F"
  },

  hero: {
    etiqueta: "🥩 Más de 75 años a su servicio",
    tituloScript: "Carne fresca",
    titulo: "de toda la vida.",
    texto: "Cortes de res, cerdo y pollo preparados a su gusto, con la confianza de más de 75 años. Arme su pedido, elija la hora y páselo a recoger.",
    imagen: "img/portada-temporal.jpg",       // PENDIENTE: foto del local o del mostrador
    imagenAlt: "Carnicería La Central",
    badges: [["🥩", "Cortes a su gusto"], ["⭐", "Tarjeta de cliente frecuente"]]
  },

  historia: {
    script: "Nuestra historia",
    titulo: "Más de 75 años llevando carne de calidad a su mesa.",
    parrafos: [
      "Carnicería La Central es un negocio con más de 75 años de trayectoria, atendido con el cuidado y la confianza que nuestros clientes conocen.",
      "Seleccionamos cada corte y lo preparamos a su gusto. Pregúntenos por los cortes especiales para su parrillada o su almuerzo familiar."
    ],
    imagenes: [],                   // PENDIENTE: 2 fotos del local [["img/archivo.jpg","descripción"], …]
    stats: [["75+", "Años de servicio"], ["100%", "Carne fresca"], ["⭐", "Cliente frecuente"]]
  },

  cta: { titulo: "¿Ya sabe qué va a llevar? 🥩", texto: "Arme su pedido y páselo a recoger a la hora que elija." }
};

export const MODULOS = {
  tarjeta: true
};

export const CONFIG = {
  whatsapp: "50683217253",
  telefonos: ["2551-1705"],
  tiempoPrep: "15–30 min",
  retiroOpciones: [30, 45, 60],
  retiroMinimo: 30,
  direccion: "PENDIENTE: dirección exacta",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Carniceria+La+Central+Artigran",
  mapaEmbed: "https://www.google.com/maps?q=Carniceria+La+Central+Artigran&output=embed",
  horario: [
    ["Lunes a sábado", "Por confirmar"],
    ["Domingo", "Por confirmar"]
  ],
  pagos: ["💵 Efectivo", "📱 SINPE Móvil", "💳 Tarjeta"]   // PENDIENTE: confirmar
};

/* =========================================================
   MENÚ — PENDIENTE: productos y precios reales del cliente.
   Esto es solo la estructura de ejemplo (precios "Por confirmar").
   ========================================================= */
export const MENU = {
  "Res": [
    { titulo: "Res", ico: "🥩", platos: [
      { nombre: "Bistec", precio: "Por confirmar", desc: "Precio por kilo" },
      { nombre: "Carne molida", precio: "Por confirmar", desc: "Precio por kilo" },
      { nombre: "Posta", precio: "Por confirmar", desc: "Precio por kilo" }
    ]}
  ],
  "Cerdo": [
    { titulo: "Cerdo", ico: "🐖", platos: [
      { nombre: "Chuleta", precio: "Por confirmar", desc: "Precio por kilo" },
      { nombre: "Costilla", precio: "Por confirmar", desc: "Precio por kilo" }
    ]}
  ],
  "Pollo": [
    { titulo: "Pollo", ico: "🍗", platos: [
      { nombre: "Pechuga", precio: "Por confirmar", desc: "Precio por kilo" },
      { nombre: "Muslo", precio: "Por confirmar", desc: "Precio por kilo" }
    ]}
  ]
};

// =========================================================
//  TARJETA DE SELLOS
// =========================================================
export const LEALTAD = {
  meta: 10,                  // PENDIENTE: confirmar cuántos sellos
  montoMinimo: 10000,        // compras de ₡10.000 o más suman sello
  modo: "porCompra",         // 1 sello por compra ≥ ₡10.000
  premio: "Premio por confirmar",   // PENDIENTE

  qr: true,                  // sello por QR de un solo uso
  qrMinutos: 3,
  esperaMinutos: 120
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

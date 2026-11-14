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

  // Textos de la sección de productos (opcionales)
  menu: {
    script: "Nuestros",
    titulo: "Productos",
    notaPrep: "🔪 Cortado al momento · listo en",
    nota: "🛒 Agregue productos, toque <b>Ver pedido</b> y elija a qué hora pasa a retirarlo · Precios en colones con IVA, sujetos a cambio. Los productos por kilo se cobran según el peso exacto."
  },

  cta: { titulo: "¿Ya sabe qué va a llevar? 🥩", texto: "Arme su pedido y páselo a recoger a la hora que elija." }
};

export const MODULOS = {
  tarjeta: true,
  granja: true          // resumen en el inicio + página granja.html (datos en GRANJA, abajo)
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
   MENÚ — productos y precios (lista del local, precios con IVA).
   precio: número en colones (o texto tal cual, ej. "Por confirmar").
   unidad: "kg" (se pide por peso) · "paquete" · "unid". Se puede poner
           por sección (vale para todos sus productos) o por producto.
   paso:   cuánto sube/baja el peso en el carrito (kg). Por defecto 0.5.
   opciones: botones de peso para agregar (kg). Por defecto [0.5, 1] → "+ ½ kg" y "+ 1 kg".
   ========================================================= */
const KG = { unidad: "kg" };
const FIAMBRE = { unidad: "kg", paso: 0.25, opciones: [0.25, 0.5] };   // embutidos por peso: de ¼ kg

export const MENU = {
  "Res": [
    { titulo: "Res", ico: "🥩", sub: "De nuestra propia granja, Cosecha Porcina · precios por kilo", ...KG, platos: [
      { nombre: "Lomito", precio: 12500 },
      { nombre: "Lomo", precio: 7800 },
      { nombre: "T-bone", precio: 8000 },
      { nombre: "Lengua", precio: 8500 },
      { nombre: "Cabeza de lomo", precio: 6800 },
      { nombre: "Posta de cuarto", precio: 6800 },
      { nombre: "Punta de solomo", precio: 6500 },
      { nombre: "Mano de piedra", precio: 6500 },
      { nombre: "Cacho de paleta", precio: 6200 },
      { nombre: "Paleta (posta)", precio: 6200 },
      { nombre: "Bistec arreglado", precio: 6200 },
      { nombre: "Pecho", precio: 5800 },
      { nombre: "Quititeña", precio: 5800 },
      { nombre: "Cubitos de res", precio: 5800 },
      { nombre: "Molida premium", precio: 5000 },
      { nombre: "Molida especial", precio: 4000 },
      { nombre: "Posta de ternero", precio: 4000 },
      { nombre: "Costilla de res", precio: 3800 },
      { nombre: "Rabo", precio: 3800 },
      { nombre: "Hueso uco", precio: 3800 },
      { nombre: "Hígado", precio: 3200 },
      { nombre: "Mondongo", precio: 3200 },
      { nombre: "Hueso de pescuezo", precio: 2900 },
      { nombre: "Hueso para sopa", precio: 800 }
    ]}
  ],
  "Cerdo": [
    { titulo: "Cerdo", ico: "🐖", sub: "De nuestra propia granja, Cosecha Porcina · precios por kilo", ...KG, platos: [
      { nombre: "Lomo de cerdo", precio: 5800 },
      { nombre: "Lomito de cerdo", precio: 5200 },
      { nombre: "Posta de cerdo", precio: 4000 },
      { nombre: "Posta de cerdo en cubitos", precio: 3900 },
      { nombre: "Chuleta de cerdo", precio: 4000 },
      { nombre: "Costilla de cerdo", precio: 4000 },
      { nombre: "Costillón", precio: 4000 },
      { nombre: "Chorizo", precio: 2200 },
      { nombre: "Manteca", precio: 1800 },
      { nombre: "Pezuña", precio: 1000 }
    ]},
    { titulo: "Ahumados La Central", ico: "🔥", sub: "De la casa · precios por kilo", ...KG, platos: [
      { nombre: "Chuleta ahumada", precio: 5400 },
      { nombre: "Costilla ahumada", precio: 7000 }
    ]}
  ],
  "Pollo": [
    { titulo: "Pollo", ico: "🍗", sub: "Precios por kilo", ...KG, platos: [
      { nombre: "Pollo entero", precio: 2800 },
      { nombre: "Pechuga", precio: 3500 },
      { nombre: "Muslo", precio: 2500 },
      { nombre: "Muslito en bolsa", precio: 3900 },
      { nombre: "Filet de pechuga", precio: 5400 },
      { nombre: "Filet BBQ", precio: 5400 },
      { nombre: "Molida de pollo (paquete)", precio: 2700, unidad: "paquete" }
    ]}
  ],
  "Pescado": [
    { titulo: "Pescado", ico: "🐟", sub: "Precios por kilo", ...KG, platos: [
      { nombre: "Tilapia", precio: 6800 },
      { nombre: "Corvina", precio: 3500 }
    ]}
  ],
  "Embutidos": [
    { titulo: "Zar", ico: "🥓", platos: [
      { nombre: "Tocineta ahumada Zar", precio: 13000, ...FIAMBRE },
      { nombre: "Salame Zar", precio: 15000, ...FIAMBRE },
      { nombre: "Jamón Span Zar", precio: 13000, ...FIAMBRE },
      { nombre: "Salchichas Zar", precio: 2000, unidad: "paquete" },
      { nombre: "Salchichas de desayuno Zar", precio: 3200, unidad: "paquete" },
      { nombre: "Pepperoni Zar", precio: 1800, unidad: "paquete" }
    ]},
    { titulo: "Zurquí", ico: "🥪", platos: [
      { nombre: "Jamón Zurquí", precio: 7000, ...FIAMBRE },
      { nombre: "Jamonada Zurquí", precio: 5800, ...FIAMBRE },
      { nombre: "Salchicha Zurquí", precio: 1800, unidad: "paquete" },
      { nombre: "Mortadela con chile Zurquí", precio: 3000, unidad: "unid" },
      { nombre: "Mortadela de pollo Zurquí", precio: 3000, unidad: "unid" }
    ]},
    { titulo: "Fud", ico: "🦃", platos: [
      { nombre: "Jamón de pavo ahumado Fud", precio: 12000, ...FIAMBRE },
      { nombre: "Jamón Span Fud", precio: 11000, ...FIAMBRE },
      { nombre: "Pechuga de pavo Fud", precio: 12000, ...FIAMBRE },
      { nombre: "Salchicha de pavo pequeña Fud", precio: 1800, unidad: "paquete" }
    ]},
    { titulo: "Don Luis", ico: "🌭", unidad: "unid", platos: [
      { nombre: "Salchichas Don Luis", precio: 2800, unidad: "paquete" },
      { nombre: "Salchichas de pollo Don Luis", precio: 2800, unidad: "paquete" },
      { nombre: "Jamón Don Luis", precio: 2800, unidad: "paquete" },
      { nombre: "Jamón de pavo Don Luis", precio: 7000 },
      { nombre: "Paté Don Luis", precio: 4800 },
      { nombre: "Salchichón de pollo Don Luis", precio: 2800 },
      { nombre: "Salchichón rueda Don Luis", precio: 1600 },
      { nombre: "Combo Don Luis", precio: 3800 }
    ]},
    { titulo: "La Única", ico: "🌭", unidad: "unid", platos: [
      { nombre: "Salchichón La Única", precio: 2200 },
      { nombre: "Mortadela La Única", precio: 2200 },
      { nombre: "Salchichón jamonado La Única", precio: 2500 },
      { nombre: "Cantones La Única", precio: 3000 }
    ]},
    { titulo: "Tucurrique", ico: "🌭", unidad: "unid", platos: [
      { nombre: "Salchichón carnicero", precio: 2500 },
      { nombre: "Salchichón de pejibaye", precio: 2500 },
      { nombre: "Salchichón parrillero", precio: 3500 },
      { nombre: "Salchichón con cerdo", precio: 2500 },
      { nombre: "Salchichón caribeño", precio: 2500 },
      { nombre: "Jamón Span Tucurrique", precio: 4000 },
      { nombre: "Pechuga de pavo Tucurrique", precio: 6000 },
      { nombre: "Jamonada Tucurrique", precio: 4000 },
      { nombre: "Morcilla", precio: 3200 },
      { nombre: "Pepperoni Tucurrique", precio: 1000, unidad: "paquete" },
      { nombre: "Salame Tucurrique", precio: 1000, unidad: "paquete" }
    ]},
    { titulo: "Cinta Azul y otros", ico: "🌭", unidad: "unid", platos: [
      { nombre: "Mortadela sin grasa Cinta Azul", precio: 3000 },
      { nombre: "Mortadela con chile Cinta Azul", precio: 3000 },
      { nombre: "Salchichón keto", precio: 2850 }
    ]}
  ],
  "Lácteos": [
    { titulo: "Lácteos", ico: "🧀", platos: [
      { nombre: "Queso fresco", precio: 3800, unidad: "kg" },
      { nombre: "Queso semiduro", precio: 4400, unidad: "kg" },
      { nombre: "Queso maduro", precio: 5900, unidad: "kg" },
      { nombre: "Mozzarella", precio: 7000, unidad: "kg" },
      { nombre: "Maduro empacado", precio: 6200, unidad: "paquete" },
      { nombre: "Mozzarella rallada", precio: 1800, unidad: "paquete" },
      { nombre: "Natilla pequeña", precio: 650, unidad: "unid" },
      { nombre: "Natilla grande", precio: 1250, unidad: "unid" },
      { nombre: "Leche agria (botella)", precio: 1000, unidad: "unid" }
    ]}
  ],
  "Otros": [
    { titulo: "Productos Don Raúl", ico: "🫙", unidad: "unid", platos: [
      { nombre: "Palmito", precio: 1500 },
      { nombre: "Pejibaye", precio: 1600 },
      { nombre: "Chiles rellenos", precio: 1800 },
      { nombre: "Chiles mitades", precio: 1300 },
      { nombre: "Palmito en tarro entero", precio: 1800 },
      { nombre: "Palmito en tarro picado", precio: 1500 }
    ]},
    { titulo: "Vegetales", ico: "🥦", unidad: "paquete", platos: [
      { nombre: "Zanahoria con vainica", precio: 1500 },
      { nombre: "Ensalada", precio: 1500 },
      { nombre: "Mixto (brócoli)", precio: 1500 }
    ]},
    { titulo: "Para la parrilla", ico: "🔥", platos: [
      { nombre: "Carbón", precio: 1400, unidad: "paquete" },
      { nombre: "Salsa de chile chipotle", precio: 2000, unidad: "unid" }
    ]}
  ]
};

// =========================================================
//  COSECHA PORCINA — la granja propia (cerdos y ganado).
//  Resumen en la página principal + página completa granja.html.
//  Fotos en assets/img/granja/. Datos de la presentación de la
//  Granja Porcina San Rafael (2025) y fotos del cliente (nov 2026).
// =========================================================
const F = "img/granja/";
export const GRANJA = {
  nombre: "Cosecha Porcina",
  ubicacion: "Granja Porcina San Rafael · Santa Cruz de Turrialba",
  script: "De nuestra granja",
  titulo: "a su mesa.",
  lema: "Alimentando vidas en todos los sentidos",
  intro: [
    "En Cosecha Porcina criamos los cerdos y el ganado que llegan a La Central. Así sabemos de dónde viene cada corte y cómo se cuidó desde el primer día.",
    "Creemos que producir con responsabilidad es producir de forma sostenible: cuidamos el bienestar de los animales, a nuestros colaboradores, a la comunidad y el entorno."
  ],
  // Resumen en la página principal
  fotosResumen: [
    [F + "maternidad.jpg", "Cerda con sus lechones en la maternidad"],
    [F + "terneros.jpg", "Terneros en el corral de la finca"],
    [F + "engorde.jpg", "Corrales de engorde de cerdos"],
    [F + "biodigestor-biogas.jpg", "Biodigestor que produce biogás"]
  ],
  pilares: [
    ["🐖", "Producción propia", "Criamos los cerdos y el ganado que llegan a nuestro mostrador: carne fresca, sin intermediarios."],
    ["❤️", "Bienestar animal", "Cada decisión en la granja se toma pensando primero en el bienestar de nuestros animales."],
    ["⚡", "Biogás", "Los desechos de los cerdos y la boñiga del ganado se convierten en biogás, una energía renovable."],
    ["🤝", "Nuestra gente", "A lo largo de nuestra historia hemos dado empleo a más de 40 colaboradores de la zona."]
  ],

  // Página completa (granja.html): bloques de texto + fotos, en orden
  hero: F + "engorde.jpg",
  bloques: [
    { id: "cerdos", ico: "🐖", titulo: "Nuestros cerdos",
      texto: [
        "Acompañamos a cada animal en todas sus etapas: desde la maternidad, donde las cerdas cuidan a sus lechones, hasta los corrales de crecimiento y engorde.",
        "Trabajamos con instalaciones techadas y ventiladas, pisos adecuados para cada etapa, comederos y agua siempre disponibles, y personal que los atiende todos los días."
      ],
      fotos: [
        [F + "maternidad.jpg", "Cerda amamantando a sus lechones"],
        [F + "lechones.jpg", "Lechones recién nacidos"],
        [F + "lechones-comedero.jpg", "Lechones en su corral con comedero"],
        [F + "lechones-corral.jpg", "Corrales de lechones"],
        [F + "engorde.jpg", "Corrales de engorde"],
        [F + "corrales.jpg", "Personal atendiendo a los cerdos"]
      ]},
    { id: "ganado", ico: "🐄", titulo: "Nuestro ganado",
      texto: [
        "Además de cerdos, criamos ganado para la carnicería. Los animales crecen en corrales amplios, con buena alimentación y cuidado diario.",
        "Así podemos ofrecer en el mostrador carne de res que conocemos desde su origen."
      ],
      fotos: [
        [F + "terneros.jpg", "Terneros en el corral"],
        [F + "terneros-corral.jpg", "Vaca con terneros"],
        [F + "ganado-comedero.jpg", "Ganado en el comedero"],
        [F + "ganado-comiendo.jpg", "Ganado alimentándose"]
      ]},
    { id: "biogas", ico: "⚡", titulo: "Energía que sale de la granja", oscuro: true,
      texto: [
        "Nada se desperdicia. Los desechos de los cerdos y la boñiga del ganado van a biodigestores, donde se descomponen sin oxígeno y producen biogás: un gas natural y renovable.",
        "Lo que queda del proceso se trata en lagunas y se aprovecha como abono para los pastos, con análisis de suelos y criterios técnicos, sin contaminar los ríos y quebradas cercanos."
      ],
      pasos: [
        ["🐖🐄", "Desechos", "Excremento de cerdo y boñiga"],
        ["🫧", "Biodigestor", "Se descomponen sin oxígeno"],
        ["⚡", "Biogás", "Gas natural renovable"],
        ["🌱", "Abono", "El efluente nutre los pastos"]
      ],
      fotos: [
        [F + "biodigestor-biogas.jpg", "Biodigestor inflado con biogás"],
        [F + "laguna-tratamiento.jpg", "Laguna del sistema de tratamiento"],
        [F + "vista-aerea.jpg", "Vista aérea de la granja y su sistema de tratamiento"]
      ]},
    { id: "equipo", ico: "🤝", titulo: "Nuestra gente",
      texto: [
        "Detrás de cada corte hay un equipo de la zona que trabaja todos los días en la granja. A lo largo de nuestra historia hemos empleado a más de 40 colaboradores locales.",
        "Buscamos crear un entorno amigable y justo para nuestros colaboradores, nuestra comunidad y nuestro entorno en general."
      ],
      fotos: [
        [F + "equipo.jpg", "Equipo de trabajo de la granja"]
      ]}
  ],
  cumplimiento: "Cumplimos los reglamentos 33601-MINAE (vertido y reúso de aguas residuales) y 42367-MAG (aprovechamiento de efluentes como abono), con regente ambiental y asesoría de AM-Biogas.",
  linea: [
    ["2016", "Dos biodigestores de 120 m³ (240.000 litros), cuando la mayoría de las granjas solo tenía lagunas abiertas."],
    ["2018", "Con la asesoría de AM-Biogas se aprueba y amplía el sistema de tratamiento de aguas residuales."],
    ["2019", "Plan agronómico: las aguas tratadas se usan como abono natural para pastos, con análisis de suelos."],
    ["2020", "Regente ambiental (consultor SETENA) da seguimiento continuo a la gestión de la granja."],
    ["2024–25", "Renovación completa del sistema de tratamiento."]
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
    apiKey: "AIzaSyB2qx_bsi2C6pLWM7DK2oEILDKUlyYYJGk",
    authDomain: "carniceria-la-central.firebaseapp.com",
    projectId: "carniceria-la-central",
    storageBucket: "carniceria-la-central.firebasestorage.app",
    messagingSenderId: "1084368341825",
    appId: "1:1084368341825:web:9f69736816007dc51d2fc0"
  },
  // Sitio de Hosting. Vacío = el sitio por defecto del proyecto (projectId.web.app).
  hostingSite: "",
  // Clave PÚBLICA de reCAPTCHA Enterprise para App Check. Vacío = sin App Check.
  appCheckSiteKey: ""
};

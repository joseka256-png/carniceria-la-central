// =========================================================
//  DATOS DEL CONTRATO ANUAL — se llena por cliente.
//  El logo, los colores y el nombre del negocio salen solos de negocio.js.
//  Lo que se deja "" sale como línea en blanco para llenar a mano.
//
//  Generar:  node contrato/generar.mjs
//  Resultado: contrato/salida/contrato-<id>.html  (y .pdf si hay Chrome)
//
//  ⚠️ Este repo es público: NO subas aquí cédulas ni cuentas.
//     Llenalas a mano en el PDF, o en una copia local que no se sube
//     (contrato/datos.local.js, que está en .gitignore y tiene prioridad).
// =========================================================

// --- Tus datos (los mismos para todos los clientes) ---
export const PROVEEDOR = {
  marca: "ISCR Tech",
  marcaLarga: "Inventions Software Costa Rica",
  nombre: "Ing. José Grey Redondo Ramírez",   // quien firma por ISCR
  cedula: "",
  telefono: "8690-1930",
  correo: "",
  web: "iscrtech.com",
  sinpe: "",             // número SINPE Móvil para los pagos
  cuenta: "",            // IBAN para transferencias (opcional)
  titularCuenta: ""
};

// --- Datos del cliente y del plan ---
export const CONTRATO = {
  razonSocial: "Artigran S.A.",
  cedulaJuridica: "",
  representante: "",
  cedulaRepresentante: "",
  direccion: "",
  telefono: "2551-1705",
  correo: "",

  inicio: "",              // "2026-12-01" → calcula las 12 fechas de pago
  diaPago: 5,              // se paga a más tardar este día de cada mes
  arranque: "",            // cobro único al firmar, en colones (ej. 100000). "" = en blanco. 0 = no aplica
  mensualidad: "",         // en colones (ej. 40000). "" = en blanco
  cambiosMes: 4,           // cambios de contenido incluidos por mes. "ilimitados" también vale
  horaExtra: "",           // tarifa por hora de trabajo fuera del plan
  diasAvisoRenovacion: 30,
  diasGraciaPago: 10,

  lugarFirma: "Cartago",
  fechaFirma: ""           // "2026-11-20"
};

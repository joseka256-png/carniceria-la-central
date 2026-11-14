// =========================================================
//  Genera el contrato anual con el branding del cliente.
//  Uso:  node contrato/generar.mjs
//  Toma: negocio.js (nombre, logo, colores, módulos) + contrato/datos.js
//  Sale: contrato/salida/contrato-<id>.html  → abrir en Chrome → Imprimir → Guardar como PDF
//        (si hay Playwright + Chrome instalados, también arma el .pdf solo)
// =========================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const AQUI = new URL(".", import.meta.url).pathname;
const RAIZ = join(AQUI, "..");
const imp = p => import(pathToFileURL(p).href + "?t=" + Date.now());
const N = await imp(join(RAIZ, "negocio.js"));
const D = await imp(existsSync(join(AQUI, "datos.local.js")) ? join(AQUI, "datos.local.js") : join(AQUI, "datos.js"));
const { NEGOCIO, MODULOS = {}, CONFIG, LEALTAD, MENU = {}, GRANJA, PROMOS } = N;
const { PROVEEDOR: P, CONTRATO: C } = D;
const { icono } = await imp(join(RAIZ, "src", "iconos.js"));

// ---------- utilidades ----------
const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const linea = (v, ancho = 180) => v === "" || v == null ? `<span class="blank" style="min-width:${ancho}px"></span>` : esc(v);
const colones = n => "₡" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const monto = (v, ancho = 120) => v === "" || v == null ? `₡ <span class="blank" style="min-width:${ancho}px"></span>` : colones(+v);
const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const fecha = s => { if (!s) return ""; const [y, m, d] = s.split("-").map(Number); return `${d} de ${MESES[m - 1]} de ${y}`; };
const b64 = p => existsSync(p) ? `data:image/png;base64,${readFileSync(p).toString("base64")}` : "";
const fuente = p => existsSync(p) ? `data:font/ttf;base64,${readFileSync(p).toString("base64")}` : "";
const col = NEGOCIO.colores;

// ---------- calendario de pagos ----------
const pagos = [];
let fin = "";
if (C.inicio) {
  const [y, m, d] = C.inicio.split("-").map(Number);
  for (let k = 0; k < 12; k++) {
    const yy = y + Math.floor((m - 1 + k) / 12), mm = (m - 1 + k) % 12;
    const dia = k === 0 && d > C.diaPago ? d : C.diaPago;
    pagos.push({ mes: `${MESES[mm][0].toUpperCase() + MESES[mm].slice(1)} ${yy}`, limite: `${dia} de ${MESES[mm]} de ${yy}` });
  }
  const f = new Date(y + 1, m - 1, d - 1);
  fin = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, "0")}-${String(f.getDate()).padStart(2, "0")}`;
} else for (let k = 0; k < 12; k++) pagos.push({ mes: "", limite: "" });
const total = C.mensualidad !== "" ? C.mensualidad * 12 + (+C.arranque || 0) : "";

// ---------- qué incluye (según los módulos activos del sitio) ----------
const nProductos = Object.values(MENU).flat().reduce((s, sec) => s + (sec.platos?.length || 0), 0);
const incluye = [
  ["store", "Sitio web completo", `Página de ${esc(NEGOCIO.nombre)} adaptada a celular y computadora, con su logo, colores, historia, horario, mapa y formas de pago.`],
  nProductos && ["shopping-cart", "Catálogo y carrito de pedidos", `Catálogo de ${nProductos} productos con precios, buscador y carrito. Los clientes arman el pedido (por kilo o por unidad), eligen la hora de retiro y lo envían por WhatsApp.`],
  MODULOS.tarjeta && ["award", "Tarjeta de cliente frecuente", `Tarjeta digital de sellos${LEALTAD?.qr ? " con código QR de un solo uso" : ""}, panel para el personal e historial de compras protegido.`],
  PROMOS && ["gift", "Slider de promociones", "Espacio para promociones de temporada (Navidad, ofertas, eventos) que se muestran y se ocultan solas por fecha."],
  MODULOS.granja && GRANJA && ["piggy-bank", `Página ${esc(GRANJA.nombre)}`, "Sección propia con galería de fotos, historia y compromiso ambiental de la granja."],
  ["credit-card", "Dominio, hosting y seguridad", "Dominio propio (.com o .cr), hospedaje en servidores de Google (Firebase) y certificado de seguridad (https) siempre activo."]
].filter(Boolean);

const cambios = C.cambiosMes === "ilimitados" ? "cambios ilimitados" : `hasta ${C.cambiosMes} cambios`;
const soporte = [
  ["Actualización de contenido", `${cambios} al mes: precios, productos nuevos o agotados, fotos, textos, horarios y feriados.`],
  ["Promociones de temporada", "Montaje de las imágenes de promociones en el slider, con fecha de inicio y fin."],
  MODULOS.tarjeta && ["Tarjeta de sellos", "Altas y bajas de usuarios del personal, revisión de uso indebido de los QR y ayuda con clientes que pierden su tarjeta."],
  ["Respaldos", "Respaldo mensual de la base de datos (clientes y sellos) y del contenido del sitio."],
  ["Monitoreo técnico", "Revisión de que el sitio, el carrito y los pedidos por WhatsApp funcionen; renovación del dominio y del certificado de seguridad."],
  ["Reporte mensual", "Resumen breve de visitas y uso del sitio, a solicitud del CLIENTE."],
  ["Atención", "Por WhatsApp, de lunes a viernes de 8 a.m. a 5 p.m. Cambios en un máximo de 2 días hábiles; si el sitio deja de funcionar, se atiende el mismo día."]
].filter(Boolean);

const noIncluye = [
  "Rediseños completos, secciones o funciones nuevas que no estén en la lista anterior.",
  "Fotografía o video profesional, diseño de logotipo y manejo de redes sociales.",
  "Publicidad pagada (Google, Facebook, Instagram).",
  "Costos de servicios de terceros si el uso del sitio supera los planes gratuitos (por ejemplo, Firebase), los cuales se consultarán antes con el CLIENTE.",
  `Cambios por encima de lo incluido en el mes, que se cobran a ${C.horaExtra !== "" ? colones(+C.horaExtra) : "₡ ______"} por hora, previa aprobación del CLIENTE.`
];

// ---------- cláusulas ----------
const cl = [];
const clausula = (titulo, cuerpo) => cl.push({ titulo, cuerpo });

clausula("Objeto", `<p>EL PROVEEDOR pone a disposición de EL CLIENTE, en modalidad de <b>alquiler mensual</b>, un sitio web para <b>${esc(NEGOCIO.nombre)}</b>, junto con su dominio, hospedaje, mantenimiento y soporte técnico, según se detalla en este contrato. No se trata de una venta del sitio: EL CLIENTE paga por el uso del servicio mientras el contrato esté vigente.</p>`);
clausula("Servicio incluido", `<div class="incluye">${incluye.map(([i, t, d]) => `<div class="item"><span class="ic">${icono(i)}</span><div><b>${t}</b><p>${d}</p></div></div>`).join("")}</div>`);
clausula("Soporte mensual", `<p>Durante la vigencia del contrato, EL PROVEEDOR brindará cada mes:</p><ul class="check">${soporte.map(([t, d]) => `<li><b>${t}.</b> ${d}</li>`).join("")}</ul><p class="nota">Los cambios no usados en un mes no se acumulan para el siguiente.</p>`);
clausula("Lo que no incluye", `<ul class="cruz">${noIncluye.map(t => `<li>${t}</li>`).join("")}</ul>`);
clausula("Plazo y renovación", `<p>Este contrato tiene una duración de <b>doce (12) meses</b>, del <b>${linea(fecha(C.inicio), 150)}</b> al <b>${linea(fecha(fin), 150)}</b>. Se renovará automáticamente por periodos iguales, salvo que alguna de las partes avise por escrito que no desea renovarlo con al menos <b>${C.diasAvisoRenovacion} días naturales</b> de anticipación al vencimiento. Al renovarse, EL PROVEEDOR podrá ajustar la mensualidad avisando con ${C.diasAvisoRenovacion} días de anticipación.</p>`);
clausula("Precio y forma de pago", `
  <div class="precios">
    ${C.arranque === 0 ? "" : `<div><small>Cobro único de arranque</small><b>${monto(C.arranque)}</b><span>al firmar el contrato</span></div>`}
    <div class="dest"><small>Mensualidad</small><b>${monto(C.mensualidad)}</b><span>12 pagos mensuales</span></div>
    <div><small>Total del primer año</small><b>${total === "" ? monto("") : colones(total)}</b><span>${C.arranque === 0 ? "12 mensualidades" : "arranque + 12 mensualidades"}</span></div>
  </div>
  <p>La mensualidad se paga <b>por adelantado</b>, a más tardar el día <b>${C.diaPago}</b> de cada mes, mediante:</p>
  <ul class="check">
    <li><b>SINPE Móvil</b> al ${linea(P.sinpe, 120)} a nombre de ${linea(P.titularCuenta || P.nombre, 200)}.</li>
    <li><b>Transferencia</b> a la cuenta IBAN ${linea(P.cuenta, 260)}.</li>
  </ul>
  <p>EL CLIENTE enviará el comprobante por WhatsApp al ${esc(P.telefono)}. Si un pago tiene más de <b>${C.diasGraciaPago} días naturales</b> de atraso, EL PROVEEDOR avisará al CLIENTE y, de no regularizarse en los 5 días siguientes, podrá suspender temporalmente el sitio hasta que se ponga al día. El cobro de arranque no es reembolsable.</p>`);
clausula("Propiedad y datos", `
  <p><b>Del CLIENTE:</b> su nombre comercial, logo, fotos, textos, precios y los datos de sus clientes.</p>
  <p><b>Del PROVEEDOR:</b> el código, la plataforma y el diseño base del sitio, que se usan bajo licencia mientras el contrato esté vigente.</p>
  <p>Si el contrato termina y EL CLIENTE está al día, EL PROVEEDOR le entregará en un máximo de 10 días hábiles un respaldo de su contenido y de los datos de la tarjeta de clientes (formato Excel/CSV), y le transferirá el dominio si así lo solicita.</p>`);
clausula("Protección de datos personales", `<p>${MODULOS.tarjeta ? "La tarjeta de cliente frecuente guarda el nombre y el número de teléfono de los clientes de EL CLIENTE. " : ""}EL PROVEEDOR tratará esa información solo para prestar este servicio, la mantendrá confidencial, no la venderá ni la compartirá con terceros y aplicará medidas razonables de seguridad, conforme a la Ley N.° 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales. EL CLIENTE es responsable de usar esos datos solo para fines de su negocio.</p>`);
clausula("Responsabilidades", `
  <p><b>EL CLIENTE</b> se compromete a entregar a tiempo la información, fotos y precios correctos, revisar los cambios publicados y pagar puntualmente. Los precios y promociones publicados en el sitio son responsabilidad del CLIENTE.</p>
  <p><b>EL PROVEEDOR</b> se compromete a mantener el sitio funcionando, atender las solicitudes en los plazos indicados y avisar con anticipación de cualquier mantenimiento. El sitio depende de servicios de terceros (Google Firebase, WhatsApp, proveedores de dominio e internet); EL PROVEEDOR no responde por fallas de esos servicios, pero hará lo posible por resolverlas lo antes posible.</p>`);
clausula("Terminación anticipada", `<p>Cualquiera de las partes puede terminar el contrato antes de su vencimiento avisando por escrito con <b>30 días naturales</b> de anticipación. EL CLIENTE pagará las mensualidades hasta el final de ese aviso. EL PROVEEDOR también podrá terminarlo si EL CLIENTE acumula dos mensualidades sin pagar.</p>`);
clausula("Comunicaciones y ley aplicable", `<p>Las partes se comunicarán por WhatsApp o correo electrónico a los contactos de este contrato. Este contrato se rige por las leyes de la República de Costa Rica; cualquier diferencia se procurará resolver primero de buena fe entre las partes.</p>`);

// ---------- HTML ----------
const logoCliente = b64(join(RAIZ, "assets", "logo.png"));
const logoIscrBlanco = b64(join(AQUI, "logos", "iscr-blanco.png"));
const logoIscrOscuro = b64(join(AQUI, "logos", "iscr-oscuro.png"));
const playfair = fuente(join(RAIZ, "assets", "fonts", "PlayfairDisplay.ttf"));

const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<title>Contrato de Cotizador web premium · ${esc(NEGOCIO.nombre)} · ${esc(P.marca)}</title>
<style>
  @font-face{font-family:'Playfair';src:url('${playfair}') format('truetype');font-weight:400 900}
  @page{size:letter;margin:16mm 16mm 18mm}
  :root{--p:${col.primario};--po:${col.primarioOsc};--a:${col.acento};--tx:#2b2f33;--gr:#5d625f;--bd:#e4dfd3;--cr:#f7f5ef}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:var(--tx);font-size:10.4pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}
  .hoja{max-width:820px;margin:auto}
  h1,h2,h3{font-family:'Playfair',Georgia,serif}
  b{font-weight:700}

  .portada{background:linear-gradient(135deg,var(--p),var(--po));color:#fff;border-radius:18px;padding:26px 30px 28px;position:relative;overflow:hidden}
  .portada::after{content:"";position:absolute;right:-60px;bottom:-80px;width:260px;height:260px;border-radius:50%;border:28px solid color-mix(in srgb,var(--a) 55%,transparent)}
  .marcas{display:flex;justify-content:space-between;align-items:center;gap:20px;position:relative;z-index:1}
  .marcas .cli{background:#fff;border-radius:12px;padding:8px 14px}
  .marcas .cli img{height:58px;width:auto;display:block}
  .marcas .iscr{height:34px;width:auto}
  .portada .tag{display:inline-block;margin-top:24px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);border-radius:50px;padding:3px 12px;font-size:8.5pt;letter-spacing:.08em;text-transform:uppercase;position:relative;z-index:1}
  .portada h1{font-size:28pt;line-height:1.08;margin:8px 0 6px;position:relative;z-index:1}
  .portada p{opacity:.92;max-width:520px;position:relative;z-index:1}

  .resumen{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0 4px}
  .resumen div{border:1px solid var(--bd);border-radius:12px;padding:10px 12px;background:var(--cr)}
  .resumen small{display:block;color:var(--gr);font-size:7.8pt;text-transform:uppercase;letter-spacing:.06em}
  .resumen b{font-size:11.5pt;color:var(--po)}

  .partes{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0 6px}
  .parte{border:1px solid var(--bd);border-top:4px solid var(--p);border-radius:12px;padding:12px 14px}
  .parte h3{font-size:12pt;color:var(--po);margin-bottom:4px}
  .parte .rol{font-size:7.8pt;letter-spacing:.1em;text-transform:uppercase;color:var(--a);font-weight:700}
  .parte p{font-size:9.4pt;margin:2px 0}
  .intro{margin:12px 0 4px;color:var(--gr)}

  .cl{margin-top:16px}
  .cl h2{break-after:avoid}
  .cl p,.cl li,.precios,.cal tr{break-inside:avoid}
  .cl h2{font-size:13.5pt;color:var(--po);display:flex;align-items:center;gap:10px;margin-bottom:6px}
  .cl h2 .n{font-family:'Helvetica Neue',Arial,sans-serif;background:var(--p);color:#fff;border-radius:8px;min-width:26px;height:26px;display:inline-grid;place-items:center;font-size:10pt}
  .cl h2::after{content:"";flex:1;height:2px;background:linear-gradient(90deg,var(--a),transparent)}
  .cl p{margin:5px 0;text-align:justify}
  .cl .nota{font-size:8.8pt;color:var(--gr);font-style:italic}
  ul.check,ul.cruz{list-style:none;margin:6px 0}
  ul.check li,ul.cruz li{position:relative;padding-left:22px;margin:4px 0}
  ul.check li::before{content:"✓";position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--p);color:#fff;font-size:8.5pt;display:grid;place-items:center;font-weight:700}
  ul.cruz li::before{content:"✕";position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:#eee;color:var(--a);font-size:8pt;display:grid;place-items:center;font-weight:700}
  .incluye{margin-top:6px;font-size:0}
  .incluye .item{width:calc(50% - 4px);display:inline-flex!important;vertical-align:top;margin:0 0 8px;font-size:10.4pt}
  .incluye .item:nth-child(odd){margin-right:8px}
  .incluye .item{display:flex;gap:10px;border:1px solid var(--bd);border-radius:12px;padding:10px 12px;break-inside:avoid}
  .incluye .ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:color-mix(in srgb,var(--p) 10%,#fff);color:var(--p);flex-shrink:0}
  .incluye .ic .i{width:17px;height:17px}
  .incluye p{margin:2px 0 0;font-size:9pt;color:var(--gr);text-align:left}
  .precios{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:8px 0}
  .precios div{border:1px solid var(--bd);border-radius:12px;padding:10px 12px;text-align:center}
  .precios .dest{background:var(--p);color:#fff;border-color:var(--p)}
  .precios small{display:block;font-size:8pt;text-transform:uppercase;letter-spacing:.06em;opacity:.8}
  .precios b{display:block;font-size:15pt;margin:2px 0}
  .precios span{font-size:8.4pt;opacity:.8}
  .precios .dest .blank{border-color:rgba(255,255,255,.8)}
  .blank{display:inline-block;border-bottom:1.2px solid #999;height:1.05em;vertical-align:bottom}

  .cal{width:100%;border-collapse:separate;border-spacing:0;margin-top:8px;font-size:9.4pt;border:1px solid var(--bd);border-radius:12px;overflow:hidden}
  .cal th{background:var(--po);color:#fff;text-align:left;padding:7px 10px;font-weight:600;font-size:8.6pt;text-transform:uppercase;letter-spacing:.05em}
  .cal td{padding:6px 10px;border-top:1px solid var(--bd);height:26px}
  .cal tr:nth-child(even) td{background:var(--cr)}
  .cal .box{display:inline-block;width:12px;height:12px;border:1.5px solid var(--gr);border-radius:3px;vertical-align:middle;margin-right:6px}

  .firmas{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:20px;break-inside:avoid}
  .firma{border-top:1.5px solid var(--tx);padding-top:8px;margin-top:56px}
  .firma b{display:block;color:var(--po)}
  .firma p{font-size:9pt;color:var(--gr);margin:1px 0}
  .lugar{margin-top:16px;break-inside:avoid}
  .pie{margin-top:22px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--bd);padding-top:10px;color:var(--gr);font-size:8.4pt}
  .pie img{height:20px}
  .salto{break-before:page}
  @media screen{body{background:#e9e7e1;padding:30px 0}.hoja{background:#fff;padding:40px 48px;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.12)}}
</style></head>
<body><div class="hoja">

<section class="portada">
  <div class="marcas">
    <div class="cli"><img src="${logoCliente}" alt="${esc(NEGOCIO.nombre)}"></div>
    <img class="iscr" src="${logoIscrBlanco}" alt="${esc(P.marca)}">
  </div>
  <span class="tag">Plan anual · Sitio web + soporte</span>
  <h1>Contrato de Cotizador<br>web premium</h1>
  <p>Alquiler del sitio de <b>${esc(NEGOCIO.nombre)}</b> con dominio, hosting, mantenimiento y soporte mensual durante 12 meses.</p>
</section>

<div class="resumen">
  <div><small>Plazo</small><b>12 meses</b></div>
  <div><small>Mensualidad</small><b>${monto(C.mensualidad, 70)}</b></div>
  <div><small>Pago</small><b>Día ${C.diaPago} de cada mes</b></div>
  <div><small>Soporte</small><b>${C.cambiosMes === "ilimitados" ? "Cambios ilimitados" : C.cambiosMes + " cambios / mes"}</b></div>
</div>

<div class="partes">
  <div class="parte">
    <span class="rol">El proveedor</span>
    <h3>${esc(P.marca)}</h3>
    <p>${esc(P.marcaLarga)}</p>
    <p>Representado por: ${linea(P.nombre, 170)}</p>
    <p>Cédula: ${linea(P.cedula, 140)}</p>
    <p>Tel.: ${esc(P.telefono)} · ${esc(P.web)}</p>
    <p>Correo: ${linea(P.correo, 170)}</p>
  </div>
  <div class="parte">
    <span class="rol">El cliente</span>
    <h3>${esc(NEGOCIO.nombre)}</h3>
    <p>${esc(C.razonSocial)} · Céd. jurídica: ${linea(C.cedulaJuridica, 110)}</p>
    <p>Representante legal: ${linea(C.representante, 150)}</p>
    <p>Cédula: ${linea(C.cedulaRepresentante, 140)}</p>
    <p>Tel.: ${esc(C.telefono)}${C.correo ? " · " + esc(C.correo) : ""}</p>
    <p>Dirección: ${linea(C.direccion, 190)}</p>
  </div>
</div>
<p class="intro">Las partes, con capacidad suficiente para obligarse, acuerdan el presente contrato de servicio, que se regirá por las siguientes cláusulas:</p>

${cl.map((c, i) => `<section class="cl"><h2><span class="n">${i + 1}</span>${esc(c.titulo)}</h2>${c.cuerpo}</section>`).join("\n")}

<section class="cl salto">
  <h2><span class="n">${cl.length + 1}</span>Calendario de pagos</h2>
  <p>${C.inicio ? "Fechas límite de pago de las 12 mensualidades del primer año:" : "Fechas límite de pago de las 12 mensualidades del primer año (se completan al firmar):"}</p>
  <table class="cal">
    <thead><tr><th>N.°</th><th>Mes</th><th>Fecha límite</th><th>Monto</th><th>Pagado / comprobante</th></tr></thead>
    <tbody>
      ${C.arranque === 0 ? "" : `<tr><td>—</td><td><b>Arranque</b></td><td>Al firmar</td><td>${monto(C.arranque, 70)}</td><td><span class="box"></span></td></tr>`}
      ${pagos.map((p, i) => `<tr><td>${i + 1}</td><td>${p.mes || '<span class="blank" style="min-width:110px"></span>'}</td><td>${p.limite || '<span class="blank" style="min-width:120px"></span>'}</td><td>${monto(C.mensualidad, 70)}</td><td><span class="box"></span></td></tr>`).join("")}
    </tbody>
  </table>
</section>

<section class="lugar">
  <p>En fe de lo anterior, firmamos en ${esc(C.lugarFirma)}, el ${linea(fecha(C.fechaFirma), 170)}, en dos tantos de igual valor.</p>
  <div class="firmas">
    <div class="firma"><b>EL PROVEEDOR</b><p>${P.nombre ? esc(P.nombre) : "Nombre: ______________________"}</p><p>Cédula: ${P.cedula ? esc(P.cedula) : "______________"}</p><p>${esc(P.marca)}</p></div>
    <div class="firma"><b>EL CLIENTE</b><p>${C.representante ? esc(C.representante) : "Nombre: ______________________"}</p><p>Cédula: ${C.cedulaRepresentante ? esc(C.cedulaRepresentante) : "______________"}</p><p>${esc(C.razonSocial)} · ${esc(NEGOCIO.nombre)}</p></div>
  </div>
</section>

<div class="pie"><img src="${logoIscrOscuro}" alt="${esc(P.marca)}"><span>${esc(P.web)} · ${esc(P.telefono)}</span></div>
</div></body></html>`;

const SAL = join(AQUI, "salida");
mkdirSync(SAL, { recursive: true });
const base = join(SAL, `contrato-${NEGOCIO.id}`);
writeFileSync(base + ".html", html);
console.log("✔ " + base + ".html");

// PDF automático (opcional): necesita `npm i -D playwright` y Chrome
try {
  const { chromium } = await import("playwright");
  const exe = ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
  const b = await chromium.launch(exe ? { executablePath: exe } : {});
  const pg = await b.newPage();
  await pg.goto(pathToFileURL(base + ".html").href);
  await pg.pdf({ path: base + ".pdf", format: "Letter", printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font-size:7.5pt;color:#888;text-align:center;font-family:Arial">${esc(NEGOCIO.nombre)} · Contrato anual · Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>` });
  await b.close();
  console.log("✔ " + base + ".pdf");
} catch (e) {
  console.log("ℹ️  Para el PDF: abrí el .html en Chrome → Imprimir → Guardar como PDF (activar 'Gráficos de fondo').");
}

// =========================================================
//  Tarjeta de cliente — vista del cliente (Firebase Firestore)
//  El cliente se registra o consulta con su teléfono.
//  Los sellos SOLO los agrega el personal desde personal.html.
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp, writeBatch }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";
import { firebaseConfig, LEALTAD, APP_CHECK_SITE_KEY } from "./firebase-config.js?v={{version}}";
import { NEGOCIO } from "./negocio.js?v={{version}}";

const $ = id => document.getElementById(id);
const KEY = NEGOCIO.id + "_tel";
const fmt = n => "₡" + Number(n).toLocaleString("es-CR");
const soloDigitos = t => (t || "").replace(/\D/g, "").slice(-8);
const telBonito = t => t.slice(0, 4) + "-" + t.slice(4);
const leerTel = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
const guardarTel = t => { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch (e) {} };

function toast(m) {
  const t = $("toast"); if (!t) return;
  t.textContent = m; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}
function msg(el, texto, tipo = "err") { el.className = "msg " + tipo; el.textContent = texto; }

// ---------- texto de reglas en la sección ----------
$("reglaMonto").textContent = fmt(LEALTAD.montoMinimo);
$("reglaMeta").textContent = LEALTAD.meta;
$("reglaPremio").textContent = LEALTAD.premio.toLowerCase();
if (LEALTAD.qr) $("reglaComo").textContent = "Al pagar, pedí el QR en la caja y escanealo con tu celular (o decí tu número de teléfono).";

// ---------- QR de la caja (?c=CODIGO) ----------
let qrPendiente = new URLSearchParams(location.search).get("c");
if (qrPendiente && !/^[A-Za-z0-9_-]{20,40}$/.test(qrPendiente)) qrPendiente = null;
if (new URLSearchParams(location.search).has("c")) history.replaceState(null, "", location.pathname + "#tarjeta");
function avisoQR(texto, tipo = "ok") {
  const a = $("qrAviso"); a.textContent = texto; a.className = "qr-aviso show" + (tipo === "err" ? " err" : "");
}
if (qrPendiente) {
  avisoQR(leerTel() ? "Sumando tu sello…" : "Tenés un sello por sumar. Escribí tu teléfono para ver o crear tu tarjeta.");
  setTimeout(() => document.getElementById("tarjeta").scrollIntoView({ behavior: "smooth" }), 300);
}
const minutosTexto = m => m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? " " + (m % 60) + " min" : ""}` : `${m} min`;

async function reclamarQR(tel) {
  if (!qrPendiente || !db) return;
  const c = qrPendiente; qrPendiente = null;
  try {
    const [cs, ts] = await Promise.all([getDoc(doc(db, "codigos", c)), getDoc(doc(db, "tarjetas", tel))]);
    if (!cs.exists()) return avisoQR("Ese QR no es válido. Pedí uno nuevo en la caja.", "err");
    const q = cs.data();
    if (q.usado) return avisoQR(q.usadoPor === tel ? "Ese QR ya se usó en tu tarjeta. ✓" : "Ese QR ya fue usado. Pedí uno nuevo en la caja.", "err");
    const creado = q.creado?.toDate ? q.creado.toDate().getTime() : Date.now();
    if (Date.now() > creado + LEALTAD.qrMinutos * 60000) return avisoQR("Ese QR venció. Pedí uno nuevo en la caja.", "err");
    if (!ts.exists()) { qrPendiente = c; return; }
    const t = ts.data();
    if (t.sellos >= LEALTAD.meta) return avisoQR("Tu tarjeta está llena: canjeá tu premio en la caja. El QR no se usó.", "err");
    const ultimo = t.ultimoQR?.toDate ? t.ultimoQR.toDate().getTime() : 0;
    const libre = ultimo + LEALTAD.esperaMinutos * 60000;
    if (ultimo && Date.now() < libre)
      return avisoQR(`Ya sumaste un sello hace poco. Podés sumar otro por QR en ${minutosTexto(Math.ceil((libre - Date.now()) / 60000))}, o pedí que te lo registren en la caja.`, "err");
    const despues = Math.min(t.sellos + q.sellos, LEALTAD.meta);
    const b = writeBatch(db);
    b.update(doc(db, "tarjetas", tel), { sellos: despues, actualizada: serverTimestamp(), ultimoCodigo: c, ultimoQR: serverTimestamp() });
    b.update(doc(db, "codigos", c), { usado: true, usadoPor: tel, usadoEn: serverTimestamp() });
    b.set(doc(db, "tarjetas", tel, "movimientos", c), { tipo: "qr", monto: q.monto, sellosAgregados: despues - t.sellos,
      sellosAntes: t.sellos, sellosDespues: despues, staffUid: q.staffUid, staffNombre: q.staffNombre, fecha: serverTimestamp() });
    await b.commit();
    avisoQR(`✓ ¡Listo! Sumaste ${despues - t.sellos} sello${despues - t.sellos > 1 ? "s" : ""}. Llevás ${despues} de ${LEALTAD.meta}.`);
  } catch (e) {
    avisoQR("No se pudo sumar el sello con ese QR (puede que ya se usó o venció). Pedí ayuda en la caja.", "err");
  }
}

let db = null;
try {
  if (firebaseConfig.apiKey.startsWith("PEGAR")) throw new Error("sin-config");
  const app = initializeApp(firebaseConfig);
  if (APP_CHECK_SITE_KEY) try { initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(APP_CHECK_SITE_KEY), isTokenAutoRefreshEnabled: true }); } catch (e) {}
  db = getFirestore(app);
} catch (e) {
  msg($("cMsg"), "La tarjeta se está configurando. Pronto vas a poder registrarte.", "err");
  $("btnConsultar").disabled = true;
}

// ---------- pintar tarjeta ----------
function pintar(t) {
  const sellos = t ? t.sellos : 0;
  $("cNombre").textContent = t ? t.nombre.split(" ")[0] : "Tu nombre aquí";
  $("cCodigo").textContent = t ? telBonito(t.telefono) : "0000-0000";
  $("cProg").textContent = `${sellos} / ${LEALTAD.meta} sellos`;
  $("sellos").innerHTML = Array.from({ length: LEALTAD.meta }, (_, i) => {
    const ultimo = i === LEALTAD.meta - 1;
    return `<div class="sello ${i < sellos ? "on" : ""} ${ultimo ? "premio" : ""}">${i < sellos ? "✓" : (ultimo ? "★" : i + 1)}</div>`;
  }).join("");
  $("premio").classList.toggle("show", sellos >= LEALTAD.meta);
  $("canjes").textContent = t && t.canjes ? `Premios canjeados: ${t.canjes}` : "";
  $("pasoConsulta").style.display = t ? "none" : "block";
  $("acciones").style.display = t ? "flex" : "none";
}

// ---------- escuchar la tarjeta en vivo ----------
let dejarDeEscuchar = null;
let sellosPrevios = null;
function escuchar(tel) {
  if (dejarDeEscuchar) dejarDeEscuchar();
  sellosPrevios = null;
  dejarDeEscuchar = onSnapshot(doc(db, "tarjetas", tel), snap => {
    if (!snap.exists()) { guardarTel(null); pintar(null); return; }
    const t = snap.data();
    if (sellosPrevios !== null && t.sellos > sellosPrevios) toast(`✓ ¡Sello agregado! Llevás ${t.sellos} de ${LEALTAD.meta}`);
    if (sellosPrevios !== null && t.sellos === 0 && sellosPrevios === LEALTAD.meta) toast("Premio canjeado. ¡Que lo disfrutés!");
    sellosPrevios = t.sellos;
    pintar(t);
  }, () => msg($("cMsg"), "No se pudo cargar la tarjeta. Revisá tu conexión."));
}

// ---------- consultar / registrar ----------
let telPendiente = null;
$("btnConsultar").onclick = async () => {
  const tel = soloDigitos($("cTel").value);
  if (tel.length !== 8) return msg($("cMsg"), "Escribí tu teléfono de 8 dígitos.");
  $("btnConsultar").disabled = true; msg($("cMsg"), "Buscando…", "ok");
  try {
    const snap = await getDoc(doc(db, "tarjetas", tel));
    if (snap.exists()) {
      msg($("cMsg"), "", "ok"); guardarTel(tel); escuchar(tel); reclamarQR(tel);
    } else {
      telPendiente = tel;
      msg($("cMsg"), "Todavía no tenés tarjeta con ese número. Escribí tu nombre para crearla.", "ok");
      $("pasoNombre").style.display = "block"; $("cNombreInput").focus();
    }
  } catch (e) { msg($("cMsg"), "No se pudo conectar. Intentá de nuevo."); }
  $("btnConsultar").disabled = false;
};

$("btnCrear").onclick = async () => {
  const nombre = $("cNombreInput").value.trim().replace(/\s+/g, " ");
  if (nombre.length < 3) return msg($("cMsg"), "Escribí tu nombre completo.");
  if (!$("cAcepto").checked) return msg($("cMsg"), "Para crear la tarjeta tenés que aceptar el aviso de privacidad.");
  if (!telPendiente) return;
  $("btnCrear").disabled = true;
  try {
    await setDoc(doc(db, "tarjetas", telPendiente), {
      nombre: nombre.slice(0, 60), telefono: telPendiente, sellos: 0, canjes: 0,
      acepto: true, aceptoFecha: serverTimestamp(),
      creada: serverTimestamp(), actualizada: serverTimestamp()
    });
    guardarTel(telPendiente); escuchar(telPendiente); reclamarQR(telPendiente);
    $("pasoNombre").style.display = "none"; msg($("cMsg"), "", "ok");
    toast("¡Tarjeta creada! Dale tu número en la caja en cada compra.");
  } catch (e) {
    msg($("cMsg"), "No se pudo crear. Puede que ese número ya tenga tarjeta: consultalo de nuevo.");
  }
  $("btnCrear").disabled = false;
};

$("verAviso").onclick = e => { e.preventDefault(); $("aviso").classList.toggle("show"); };

$("btnSalir").onclick = () => {
  if (dejarDeEscuchar) dejarDeEscuchar();
  guardarTel(null); $("cTel").value = ""; $("cNombreInput").value = ""; $("cAcepto").checked = false;
  $("pasoNombre").style.display = "none"; pintar(null);
};

// ---------- inicio ----------
pintar(null);
const guardado = leerTel();
if (db && guardado) { escuchar(guardado); reclamarQR(guardado); }

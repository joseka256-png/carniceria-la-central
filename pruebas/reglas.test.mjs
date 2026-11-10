// Pruebas de las reglas de Firestore (tarjeta + sello por QR).
// Correr:  npm install && npm run test:reglas   (necesita Java para el emulador)
import { test, before, after, beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, writeBatch, serverTimestamp, Timestamp } from "firebase/firestore";
import { LEALTAD as L } from "../negocio.js";

const LEALTAD = { qrMinutos: 3, esperaMinutos: 120, ...L };
const TEL = "88887777", OTRO = "88886666";
let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-reglas",
    firestore: { rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8") }
  });
});
after(() => env.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx => {
    const db = ctx.firestore();
    await setDoc(doc(db, "staff", "caja1"), { nombre: "Caja" });
    for (const t of [TEL, OTRO])
      await setDoc(doc(db, "tarjetas", t), { nombre: "Cliente " + t, telefono: t, sellos: 2, canjes: 0, acepto: true,
        aceptoFecha: Timestamp.now(), creada: Timestamp.now(), actualizada: Timestamp.now() });
  });
});

const cliente = () => env.unauthenticatedContext().firestore();
const caja = () => env.authenticatedContext("caja1").firestore();
const codigoId = n => ("codigoDePrueba" + n).padEnd(24, "x");

async function crearCodigo(id, sellos = 1, { creado } = {}) {
  if (creado) return env.withSecurityRulesDisabled(ctx => setDoc(doc(ctx.firestore(), "codigos", id),
    { sellos, monto: 15000, staffUid: "caja1", staffNombre: "Caja", creado, usado: false }));
  return setDoc(doc(caja(), "codigos", id), { sellos, monto: 15000, staffUid: "caja1", staffNombre: "Caja", creado: serverTimestamp(), usado: false });
}

// Igual que tarjeta.js
async function reclamar(db, c, tel, { sellosDespues, sellosAntes = 2, extra = {} } = {}) {
  const despues = sellosDespues ?? sellosAntes + 1;
  const b = writeBatch(db);
  b.update(doc(db, "tarjetas", tel), { sellos: despues, actualizada: serverTimestamp(), ultimoCodigo: c, ultimoQR: serverTimestamp(), ...extra });
  b.update(doc(db, "codigos", c), { usado: true, usadoPor: tel, usadoEn: serverTimestamp() });
  b.set(doc(db, "tarjetas", tel, "movimientos", c), { tipo: "qr", monto: 15000, sellosAgregados: despues - sellosAntes,
    sellosAntes, sellosDespues: despues, staffUid: "caja1", staffNombre: "Caja", fecha: serverTimestamp() });
  return b.commit();
}

test("la caja puede generar un QR; un cliente no", async () => {
  await assertSucceeds(crearCodigo(codigoId(1)));
  await assertFails(setDoc(doc(cliente(), "codigos", codigoId(2)),
    { sellos: 1, monto: 15000, staffUid: "x", staffNombre: "x", creado: serverTimestamp(), usado: false }));
});

test("el cliente suma 1 sello con un QR válido", async () => {
  await crearCodigo(codigoId(1));
  await assertSucceeds(reclamar(cliente(), codigoId(1), TEL));
  const t = (await getDoc(doc(cliente(), "tarjetas", TEL))).data();
  if (t.sellos !== 3) throw new Error("esperaba 3 sellos, hay " + t.sellos);
});

test("no puede ponerse más sellos de los que trae el QR", async () => {
  await crearCodigo(codigoId(1));
  await assertFails(reclamar(cliente(), codigoId(1), TEL, { sellosDespues: 9 }));
});

test("el mismo QR no se puede usar dos veces (ni en otra tarjeta)", async () => {
  await crearCodigo(codigoId(1));
  await assertSucceeds(reclamar(cliente(), codigoId(1), TEL));
  await assertFails(reclamar(cliente(), codigoId(1), OTRO));
});

test("un QR vencido no sirve", async () => {
  const viejo = Timestamp.fromMillis(Date.now() - (LEALTAD.qrMinutos + 1) * 60000);
  await crearCodigo(codigoId(1), 1, { creado: viejo });
  await assertFails(reclamar(cliente(), codigoId(1), TEL));
});

test("respeta la espera mínima entre sellos por QR", async () => {
  await crearCodigo(codigoId(1)); await crearCodigo(codigoId(2));
  await assertSucceeds(reclamar(cliente(), codigoId(1), TEL));
  await assertFails(reclamar(cliente(), codigoId(2), TEL, { sellosAntes: 3 }));
});

test("sin QR, el cliente no puede tocar sus sellos", async () => {
  await assertFails(updateDoc(doc(cliente(), "tarjetas", TEL), { sellos: 3, actualizada: serverTimestamp() }));
});

test("con un QR inventado no pasa nada", async () => {
  await assertFails(reclamar(cliente(), codigoId(99), TEL));
});

test("no pasa de la meta: con tarjeta casi llena, queda en la meta", async () => {
  await env.withSecurityRulesDisabled(ctx => updateDoc(doc(ctx.firestore(), "tarjetas", TEL), { sellos: LEALTAD.meta - 1 }));
  await crearCodigo(codigoId(1), 3);
  await assertFails(reclamar(cliente(), codigoId(1), TEL, { sellosAntes: LEALTAD.meta - 1, sellosDespues: LEALTAD.meta + 2 }));
  await assertSucceeds(reclamar(cliente(), codigoId(1), TEL, { sellosAntes: LEALTAD.meta - 1, sellosDespues: LEALTAD.meta }));
});

test("con la tarjeta llena no se puede usar QR", async () => {
  await env.withSecurityRulesDisabled(ctx => updateDoc(doc(ctx.firestore(), "tarjetas", TEL), { sellos: LEALTAD.meta }));
  await crearCodigo(codigoId(1));
  await assertFails(reclamar(cliente(), codigoId(1), TEL, { sellosAntes: LEALTAD.meta, sellosDespues: LEALTAD.meta }));
});

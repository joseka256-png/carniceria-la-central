// No editar: los datos vienen de negocio.js
import { FIREBASE, LEALTAD as L } from "./negocio.js";
export const firebaseConfig = FIREBASE.config;
export const APP_CHECK_SITE_KEY = FIREBASE.appCheckSiteKey || "";
export const LEALTAD = { qr: false, qrMinutos: 3, esperaMinutos: 120, ...L };

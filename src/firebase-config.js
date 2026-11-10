// No editar: los datos vienen de negocio.js
import { FIREBASE, LEALTAD } from "./negocio.js";
export const firebaseConfig = FIREBASE.config;
export const APP_CHECK_SITE_KEY = FIREBASE.appCheckSiteKey || "";
export { LEALTAD };

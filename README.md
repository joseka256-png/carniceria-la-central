# Plantilla de sitio para negocios — ISCR Tech

Sitio con menú y pestañas, carrito con pedidos por WhatsApp y hora de retiro, mapa, horario y formas de pago. Opcionalmente trae la **tarjeta de sellos** con panel del personal (Firebase). Salió del sitio de Soda La Casita, que viene como ejemplo.

**Regla de oro:** por cliente se edita **solo `negocio.js` y la carpeta `assets/`**. Todo lo demás se genera.

## Estructura

| Ruta | Qué es | ¿Se edita por cliente? |
| --- | --- | --- |
| `negocio.js` | Datos del negocio: textos, colores, contacto, menú, sellos, Firebase | **Sí** |
| `assets/` | `logo.png`, `favicon.png`, `img/` (fotos), `fonts/` | **Sí** (fotos y logo) |
| `src/` | Páginas con `{{placeholders}}`: `index.html`, `personal.html`, `tarjeta.js`, `firestore.rules` | No (solo mejoras para todos) |
| `build.mjs` | Valida `negocio.js` y arma `dist/`, `firebase.json`, `.firebaserc` y `firestore.rules` | No |
| `.github/workflows/deploy.yml` | Publica solo en Firebase Hosting | No |
| `soporte/` | Restaurar respaldos de tarjetas (solo ISCR Tech, nunca se publica) | No |

`dist/`, `firebase.json`, `.firebaserc` y `firestore.rules` **no se suben a Git**: se generan con `node build.mjs`.

## Comandos (Node 18+)

    node build.mjs        # valida y arma dist/
    npm run preview       # build + servidor local para ver el sitio
    npm run deploy        # build + publicar a mano (si no se usa el Action)
    npm run reglas        # build + publicar reglas de Firestore (solo con tarjeta)

Si falta un dato o tiene un formato malo (WhatsApp, colores, id), el build **falla con un mensaje claro** y no se publica nada.

## Cliente nuevo (checklist)

1. **GitHub:** en este repo, tocar **Use this template → Create a new repository**. Nombre sugerido: el `id` del negocio (ej. `soda-la-casita`).
2. **`negocio.js`:** completar `NEGOCIO`, `CONFIG`, `MENU`. Si usa sellos, también `LEALTAD`. Activar o desactivar `MODULOS.tarjeta`.
3. **`assets/`:** cambiar el logo, el favicon y las fotos. Las rutas tienen que coincidir con las de `negocio.js`.
4. **Firebase:**
   - **Con tarjeta de sellos** → un **proyecto nuevo** solo para el cliente (los datos y las reglas quedan aislados).
     1. Crear el proyecto con la cuenta del negocio. Activar **Firestore** (modo producción) y **Authentication → Correo/contraseña**.
     2. Agregar una app web y pegar su `firebaseConfig` en `FIREBASE.config`.
     3. Ejecutar `npm run reglas`.
     4. Crear el usuario del personal en Authentication. Luego, en Firestore, crear `staff/{UID}` con el campo `nombre`.
   - **Sin tarjeta (solo sitio)** → usar un proyecto compartido de hosting (ej. `iscrtech-sitios-01`).
     1. Crear el sitio: `npx firebase-tools hosting:sites:create <id-del-negocio> --project iscrtech-sitios-01`.
     2. En `negocio.js`: `FIREBASE.config.projectId = "iscrtech-sitios-01"` y `FIREBASE.hostingSite = "<id-del-negocio>"`.
5. **Deploy automático:** dar acceso a la cuenta de servicio (ver abajo) y hacer push a `main`. El sitio queda en `https://<proyecto o sitio>.web.app`.
6. **Dominio:** en Firebase → Hosting → **Agregar dominio personalizado**. Pegar los registros A/TXT en el DNS del dominio. Si el sitio tiene tarjeta, también agregar el dominio en **Authentication → Configuración → Dominios autorizados**.

## Deploy automático (GitHub Actions)

- **Push a `main`** → publica en vivo.
- **Pull request** → publica una **URL de vista previa** (dura 7 días) y la comenta en el PR. Sirve para enseñarle cambios al cliente antes de publicarlos.

**Configuración, una sola vez para todos los clientes:**
1. En un proyecto de administración (ej. `iscrtech-admin`): Google Cloud → IAM → **Cuentas de servicio** → crear `github-deploy`.
2. Crear una **clave JSON** de esa cuenta.
3. Guardar la clave en GitHub como secreto `FIREBASE_SERVICE_ACCOUNT`:
   - en la **organización** (Settings → Secrets → Actions), para que todos los repos la hereden, o
   - en cada repo: `gh secret set FIREBASE_SERVICE_ACCOUNT < clave.json`.
   Después, **borrar la clave del disco**.

**Por cada cliente nuevo:** en Google Cloud → IAM del proyecto del cliente, agregar `github-deploy@iscrtech-admin.iam.gserviceaccount.com` con estos roles:
- **Administrador de Firebase Hosting**
- **Lector de claves de API**
- **Lector de Cloud Run**

Si el cliente usa el proyecto compartido de sitios, este paso ya está hecho.

## Mejoras para todos los clientes

Las mejoras (diseño, carrito, panel) se hacen en `src/` de **esta plantilla**. Para llevarlas a un cliente existente, copiar los archivos de `src/` (y `build.mjs` si cambió) a su repo. Su `negocio.js` no se toca.

## Tarjeta de sellos: cómo funciona

- El cliente se registra con su teléfono (8 dígitos) y su nombre. La tarjeta se guarda en `tarjetas/{telefono}`.
- Al pagar, el personal busca al cliente en `/personal`, escribe el monto y toca **Registrar compra**.
- Cuando completa `LEALTAD.meta` sellos, aparece **Canjear premio** y la tarjeta vuelve a 0.
- Solo los usuarios en `staff/{uid}` pueden sumar sellos, canjear, ver el historial y listar clientes. El historial no se puede editar ni borrar.
- La meta de sellos se copia sola a `firestore.rules` en cada build. Si se cambia, ejecutar `npm run reglas`.

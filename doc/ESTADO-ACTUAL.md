# Estado actual de Vegazetas

Inventario del código revisado el 15 de noviembre de 2026. Describe el estado
tras la refactorización (sprints 1–8 completados), no una auditoría completa.

## Alcance funcional observado

La aplicación contiene registro, inicio y cierre de sesión, recuperación de
contraseña y gestión de recetas: creación, edición, eliminación, imágenes,
etiquetas, ingredientes y pasos. También incluye publicación, descubrimiento
de recetas y favoritos. Las rutas de pantalla están en
[`App.tsx`](../app/src/App.tsx) y [`Home`](../app/src/view/Home/index.tsx).
La existencia de código para una función no garantiza que se haya comprobado
su funcionamiento en todos los escenarios.

## Estructura y tecnologías

| Directorio        | Responsabilidad actual                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`app/`](../app/) | SPA React 19 con React Router 7, Vite 8 y Tailwind CSS; 100% TypeScript.                                                                   |
| [`api/`](../api/) | API Express 5 en TypeScript con módulos ES, Mongoose y MongoDB; arquitectura por capas en `modules/`.                                      |
| [`com/`](../com/) | Paquete local compartido 100% TypeScript: esquemas Zod 4, validadores y clases de error; lo consumen `app` y `api` mediante `file:../com`. |
| [`doc/`](./)      | Documentación e imágenes.                                                                                                                  |

Cada aplicación tiene su propio `package.json` y `package-lock.json`; no hay
un gestor de workspaces definido en la raíz. Los archivos `.node-version`
indican Node 26.13.1. La refactorización a TypeScript está completa:
API, frontend y paquete compartido son 100% TypeScript. Los archivos que
permanecen en JavaScript son por decisión: specs de Vitest, soporte de pruebas
y `vitest.config.js`.

`com` usa Zod 4.6.7 para la validación de todos los campos: etiquetas, títulos,
descripciones, imágenes, dificultades, tiempos, texto y notas de pasos, cantidad,
indicador principal, unidad y anotación de ingredientes, nombre, usuario, correo,
contraseña, identificadores, índices y dirección. Una revisión correctiva alineó
límites y mensajes, endureció los tipos opcionales y el formato de IDs, y conectó
la validación de contraseña en el registro web.

El tiempo de receta es opcional: al proporcionarlo se exigen entre 5 y 9999
minutos enteros, y al omitirlo en una edición se elimina el campo. Los ceros
históricos se muestran como ausencia sin migrar la base de datos.

## Recorrido de una petición

1. React 19 monta la aplicación con `BrowserRouter`. Las vistas y componentes
   están en [`app/src/view/`](../app/src/view/), con rutas y estado compartido
   en `App.tsx`. El contexto de aplicación (`context.ts`) gestiona alertas y
   confirmación. Todo el frontend es TypeScript.
2. Las funciones de [`app/src/logic/`](../app/src/logic/) validan datos con
   `com/validate` (Zod) y usan `authenticatedFetch` contra `VITE_API_URL`.
   Todo el módulo está en TypeScript: sesión, autenticación, recetas y elementos
   anidados. El inicio de sesión guarda el JWT de 24 horas en `sessionStorage`;
   las respuestas `401` de operaciones protegidas cierran la sesión globalmente.
3. [`api/index.ts`](../api/index.ts) carga `.env` con `config/loadEnv.ts`,
   conecta Mongoose a MongoDB y arranca la aplicación Express. Los routers
   de usuarios y recetas (`routes/`) montan los handlers de cada módulo.
4. Cada módulo en [`api/modules/`](../api/modules/) contiene composición,
   caso de uso, handler y repositorio Mongoose tipado. La composición conecta
   las dependencias. El middleware de errores traduce clases de `com` a
   respuestas HTTP.

La API usa arquitectura por capas: 17 módulos en `modules/` cubren usuarios
(registro, autenticación, nombre, username, recuperación/restablecimiento de
contraseña, favoritos) y recetas (crear, consultar, listar, editar, eliminar,
publicar, ingredientes, pasos, imágenes, etiquetas).

## Datos

- **Usuario:** nombre, correo, nombre de usuario, contraseña y referencias a
  recetas favoritas. Correo y nombre de usuario tienen índice único declarado.
- **Receta:** autor, título, imágenes, fecha, descripción, tiempo, dificultad,
  etiquetas, ingredientes, pasos y estado `published`. El título tiene índice
  único declarado.
- **Ingrediente y paso:** se definen como esquemas Mongoose y se insertan en
  arrays dentro de cada receta. El paso incluye un campo de orden.

La definición efectiva está en [`models.ts`](../api/data/models.ts) con tipos
`InferSchemaType` y documentos tipados (`UserDocument`, `RecipeDocument`). Las
imágenes se representan como cadenas; el esquema no define almacenamiento de
archivos.

## Superficie HTTP

La API expone `GET /health` y dos routers:

- `/users`: registro, autenticación, nombre, nombre de usuario, recuperación
  y restablecimiento de contraseña y alternancia de favoritos.
- `/recipes`: creación, consulta, actualización y eliminación; listados de
  recetas propias, publicadas y favoritas; publicación y operaciones sobre
  ingredientes, pasos, imágenes y etiquetas.

El detalle de métodos y rutas está en
[`users/index.ts`](../api/routes/users/index.ts) y
[`recipes/index.ts`](../api/routes/recipes/index.ts). No se ha generado ni
validado un contrato OpenAPI.

### Contratos observados en los handlers

Este resumen procede principalmente de la lectura del código; aún faltan
pruebas HTTP para la mayoría de las respuestas y errores.

| Operación                                                             | Entrada principal                       | Respuesta de éxito                                                                                    |
| --------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `POST /users`                                                         | `name`, `email`, `username`, `password` | `201`, sin cuerpo                                                                                     |
| `POST /users/auth`                                                    | `email`, `password`                     | `200`, token JWT como cadena JSON                                                                     |
| `GET /users/name`, `GET /users/username`                              | Token de sesión                         | `200`, nombre o nombre de usuario como cadena JSON                                                    |
| `POST /users/password/recover`                                        | `email`                                 | `200`, objeto con mensaje                                                                             |
| `POST /users/password/reset/:token`                                   | Token en la ruta y `newPassword`        | `204`, sin cuerpo                                                                                     |
| `PATCH /users/favorites/:recipeId`                                    | Token de sesión e ID de receta          | `200`, documento de usuario serializado sin `password`                                                |
| `POST /recipes`                                                       | Token y campos de receta                | `201`, ID como cadena JSON                                                                            |
| `GET /recipes/my-recipes`, `/published-recipes`, `/favorites-recipes` | Token                                   | `200`, lista de recetas                                                                               |
| `GET /recipes/:recipeId`                                              | Token e ID                              | `200`, receta con `own` e `isFavorite`                                                                |
| `PATCH /recipes/:recipeId`                                            | Token, ID y campos editables            | `204`, sin cuerpo                                                                                     |
| `DELETE /recipes/:recipeId`                                           | Token e ID                              | `204`, sin cuerpo                                                                                     |
| `PATCH /recipes/:recipeId/publish`                                    | Token e ID                              | `200`, objeto con `published`                                                                         |
| Operaciones de ingredientes, pasos, imágenes y etiquetas              | Token, ID y datos del elemento          | `201` al añadir; `204` al modificar o eliminar. Las altas de ingrediente y paso devuelven un ID JSON. |

Los handlers protegidos comparten la validación del JWT y responden `401` para
credenciales ausentes, inválidas, caducadas o sin `exp`. El middleware traduce
errores propios a `400`, `401`, `403`, `404`, `409` o `500`; otros errores se
convierten en `500`. En producción, el errorHandler usa mensaje genérico
("Internal server error") evitando exponer detalles internos.

**Estado de sprints completados:** los sprints 1–8 están completados. El sprint 1
estableció la línea base y protección de datos. El sprint 2 migró las pruebas a
Vitest y caracterizó contratos HTTP. El sprint 3 configuró TypeScript, Node 22/24/26,
y migró las validaciones a Zod. El sprint 4 creó el primer módulo vertical
(`GET /users/name`). El sprint 5 migró todos los módulos de usuarios. El sprint 6
migró todo el módulo de recetas. El sprint 7 migró el frontend a TypeScript.
El sprint 8 cerró la migración de `com/` y `api/` a TypeScript, aplicó correcciones
de seguridad y actualizó React a 19.

**Despliegue v2.0.0:** la versión v2.0.0 está desplegada en Netlify (frontend) y
Render (backend). Los cambios de contrato de autenticación (`401` para credenciales
inválidas), el campo `isFavorite` en `my-recipes` y el tiempo opcional están
activos. Consulta la [guía de despliegue](./DEPLOYMENT.md) para detalles de
configuración y problemas conocidos.

**Corrección local desplegada:** la respuesta de alternancia de favoritos incluía
el campo `password` con el hash. Se eliminó ese campo sin cambiar los demás ni la
contraseña almacenada.

## Configuración y ejecución

La guía básica de instalación está en el [README principal](../README.md).
No se deben guardar credenciales en el repositorio.

| Variable                    | Uso en el código                                                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGO_URL`                 | Conexión de la API.                                                                                                                            |
| `PORT`                      | Puerto de escucha de la API.                                                                                                                   |
| `JWT_SECRET`                | Firma y verificación de tokens.                                                                                                                |
| `FRONTEND_URL`, `MAIL_FROM` | Enlace y remitente de recuperación de contraseña.                                                                                              |
| `NODE_ENV`                  | Selección del transporte y rama de envío de correo. En desarrollo debe establecerse explícitamente a `development` para usar la rama Ethereal. |
| `RESEND_API_KEY`            | Proveedor Resend en producción.                                                                                                                |
| `SPEC_MONGO_URL`            | Base de datos usada por las pruebas `*.spec.js`. Debe ser exclusiva y desechable.                                                              |
| `TEST_MONGO_URL`            | Variable de entorno sin uso activo tras eliminar los scripts manuales.                                                                         |
| `MONGO_URL_PROD`            | Usada por los scripts de actualización cuando se ejecutan en modo producción.                                                                  |
| `VITE_API_URL`              | URL de la API en el frontend.                                                                                                                  |

El correo de desarrollo utiliza Ethereal y requiere acceso a la red; el de
producción utiliza Resend. No se han validado aquí las credenciales ni los
servicios externos.

## Pruebas y calidad

- En `api`, `npm test` ejecuta secuencialmente con Vitest las suites en
  `test/*.spec.js`. Usan MongoDB real, no son únicamente unitarias. La
  configuración selecciona explícitamente las suites permitidas.
- **Precaución:** varias suites borran todos los usuarios y recetas de la base
  configurada en `SPEC_MONGO_URL` antes y después de cada prueba. Nunca apuntar
  esa variable a una base de desarrollo compartida o de producción.
- La suite de recuperación de contraseña usa un proveedor simulado. La prueba
  de integración con Ethereal es opcional y separada. El script `test-coverage`
  genera cobertura de las suites habituales de Vitest.
- Las suites solo aceptan la URI local documentada y conectan directamente;
  se reutiliza un contenedor dedicado y sus datos pueden borrarse en cada prueba.
- En `app` existen `npm run lint`, `npm run build`, `npm run typecheck` y
  `npm run test:e2e`. La suite Playwright cubre registro, sesión, credenciales
  incorrectas, recetas, publicación y favoritos con Chromium y servicios locales.
- CI configurado en `.github/workflows/ci.yml`: jobs paralelos de lint, typecheck,
  build, Vitest y Playwright; MongoDB 8 como Docker service. Husky ejecuta
  lint y typecheck en el hook pre-commit local.

**Resultados actuales de validación:**

- Vitest API: **434 pruebas** en 27 archivos (434 pasan, 0 fallan).
- Playwright E2E: **68 pruebas** en 11 archivos.
- `tsc --noEmit` en `api/`: pasa sin errores con `allowJs: false`.
- `vite build` en `app/`: compila sin errores (197 módulos).
- Lint del frontend: pasa sin advertencias.

## Línea base y actualizaciones

El proyecto requiere Node.js `^26.13.1` (LTS). Cada paquete declara
`engines.node` para que npm rechace motores incompatibles. El despliegue en
Netlify y Render usa Node 26.

### Dependencias directas actuales

Versiones declaradas en `package.json` tras la refactorización:

| API (producción)   | Versión     |
| ------------------ | ----------- |
| bcryptjs           | ^3.0.2      |
| com                | file:../com |
| cors               | ^2.8.5      |
| express            | ^5.3.0      |
| express-rate-limit | ^8.7.4      |
| helmet             | ^8.3.0      |
| jsonwebtoken       | ^9.0.2      |
| mongoose           | ^9.0.1      |
| nodemailer         | ^10.5.0     |
| resend             | ^6.38.0     |

| API (desarrollo)    | Versión  |
| ------------------- | -------- |
| @types/bcryptjs     | ^2.4.6   |
| @types/cors         | ^2.8.19  |
| @types/express      | ^5.0.6   |
| @types/jsonwebtoken | ^9.0.10  |
| @types/node         | ^26.6.6  |
| @types/nodemailer   | ^8.0.2   |
| @vitest/coverage-v8 | ^5.1.0   |
| tsx                 | ^4.23.15 |
| typescript          | ^7.0.2   |
| vitest              | ^5.1.0   |

| Frontend (producción) | Versión     |
| --------------------- | ----------- |
| clsx                  | ^2.0.0      |
| com                   | file:../com |
| react                 | ^19.0.0     |
| react-dom             | ^19.0.0     |
| react-icons           | ^5.7.0      |
| react-router-dom      | ^7.18.5     |

| Frontend (desarrollo)       | Versión |
| --------------------------- | ------- |
| @playwright/test            | ^1.65.0 |
| @tailwindcss/vite           | ^4.3.5  |
| @types/react                | ^19.0.0 |
| @types/react-dom            | ^19.0.0 |
| @vitejs/plugin-react        | ^6.3.0  |
| eslint                      | ^10.2.1 |
| eslint-plugin-react-hooks   | ^7.1.1  |
| eslint-plugin-react-refresh | ^0.5.8  |
| tailwindcss                 | ^4.3.5  |
| typescript                  | ^7.0.2  |
| vite                        | ^8.3.8  |

| Compartido (com) | Versión |
| ---------------- | ------- |
| zod              | ^4.6.7  |

### Entornos y protección de datos

El frontend está desplegado en Netlify (`https://vegazetas.netlify.app`) y la
API en Render (`https://vegazetas.onrender.com`), ambos con Node 26. El clúster
de MongoDB Atlas es gratuito. Las pruebas usan una instancia local desechable
en Docker.

La base de producción se creó vacía al desplegar la v2; no se migraron los
datos de la v1. Consulta la [guía de despliegue](./DEPLOYMENT.md) para la
configuración de Netlify y Render.

## Seguridad

Correcciones aplicadas en el sprint 8:

- **CORS configurable:** `api/app.ts` lee `FRONTEND_URL` del entorno; si está
  configurada, restringe el origen; si no, deja CORS abierto (desarrollo local).
- **errorHandler protegido:** mensaje genérico en producción, evitando exponer
  detalles internos.
- **JWT Algorithm Confusion Attack:** `jwt.verify()` restringe el algoritmo a
  `HS256` con `{ algorithms: ['HS256'] }`.
- **Proyección de campos en favoritos:** desestructuración explícita de campos
  necesarios en lugar de `delete response.password`.
- **Middlewares de seguridad:** Helmet (`securityHeaders.ts`) y rate limiting
  (`rateLimiter.ts`) aplicados.

Correcciones de seguridad aplicadas:

- **Token de password recovery en path param:** el enlace de recuperación usa
  ahora `/password-reset/{token}` (path param) en lugar de query param, evitando
  que el token aparezca en los logs del servidor y el historial del navegador.
- **Rate limiting global:** se aplica un límite de 100 peticiones por 15 minutos
  a todos los endpoints, complementando los límites específicos de auth.
- **CSP en el frontend de Netlify:** se añaden headers de seguridad (`_headers`)
  con Content Security Policy, HSTS, X-Frame-Options y Permissions Policy.

Hallazgos documentados:

- Token en `sessionStorage` vulnerable a XSS: patrón común en SPAs; riesgo
  aceptado con mitigación de CSP tanto en la API (Helmet) como en el frontend
  (Netlify `_headers`).

## Puntos pendientes

- **Tipos de repositorio:** `com/repo-types.ts` contiene `UserFavorites` para
  tipar `.lean()` + `.select('favorites')`. Cuando los modelos usen los tipos
  inferidos de Mongoose de forma completa, evaluar si sustituir esta interfaz.
- **Despliegue:** la v2.0.0 está desplegada. Consulta la [guía de despliegue](./DEPLOYMENT.md).
- **Accesibilidad:** revisar con teclado, lectores de pantalla, formularios,
  foco, contraste y diseño adaptable; no se ha realizado una auditoría WCAG.
- **Rendimiento:** medir experiencia real antes de fijar objetivos.
- **CI/CD:** pipeline activo con GitHub Actions (CI en PR) y Husky (hooks locales).
  El despliegue automático de Netlify y Render se mantiene sin cambios.
- **OpenAPI:** generar y validar contrato de API.

## Referencias para la arquitectura

El [ejemplo backend](https://github.com/DATW-2026/IFCD0210_2026/tree/main/14.Prisma_API)
inspiró la separación por módulos, repositorios, controladores y routers.
El [ejemplo frontend](https://github.com/DATW-2026/IFCD0210_2026/tree/main/10.Front)
inspiró la organización funcional en TypeScript.
Véase el [esquema del proyecto](./ESTRUCTURA-PROYECTO.md) para la estructura actual.

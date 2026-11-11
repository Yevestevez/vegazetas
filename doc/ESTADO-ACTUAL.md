# Estado actual de Vegazetas

Inventario del código revisado el 11 de noviembre de 2026. Describe el punto
de partida, no una arquitectura objetivo ni una auditoría completa.

## Alcance funcional observado

La aplicación contiene registro, inicio y cierre de sesión, recuperación de
contraseña y gestión de recetas: creación, edición, eliminación, imágenes,
etiquetas, ingredientes y pasos. También incluye publicación, descubrimiento
de recetas y favoritos. Las rutas de pantalla están en
[`App.jsx`](../app/src/App.jsx) y [`Home`](../app/src/view/Home/index.jsx).
La existencia de código para una función no garantiza que se haya comprobado
su funcionamiento en todos los escenarios.

## Estructura y tecnologías

| Directorio | Responsabilidad actual |
| --- | --- |
| [`app/`](../app/) | SPA React 18 con React Router, Vite y Tailwind CSS, escrita en JavaScript y JSX. |
| [`api/`](../api/) | API Express en JavaScript con módulos ES, Mongoose y MongoDB. |
| [`com/`](../com/) | Paquete local compartido de validaciones y clases de error; lo consumen `app` y `api` mediante `file:../com`. |
| [`doc/`](./) | Documentación e imágenes. Parte de la documentación anterior es histórica y puede no reflejar las funciones más recientes. |

Cada aplicación tiene su propio `package.json` y `package-lock.json`; no hay
un gestor de workspaces definido en la raíz. Los archivos `.node-version`
indican Node 24.22.1. El frontend ya utiliza Vite: no hace falta incorporarlo
para poder migrar a TypeScript.

## Recorrido de una petición

1. React monta la aplicación con `BrowserRouter`. Las vistas y componentes
   están en [`app/src/view/`](../app/src/view/), con rutas y estado compartido
   en `App.jsx` y `context.js`.
2. Las funciones de [`app/src/logic/`](../app/src/logic/) validan datos y usan
   `fetch` contra `VITE_API_URL`. El inicio de sesión guarda el JWT en
   `sessionStorage`.
3. [`api/index.js`](../api/index.js) conecta Mongoose a MongoDB, crea Express
   y monta los routers de usuarios y recetas. Las rutas delegan en handlers
   que llaman a funciones de [`api/logic/`](../api/logic/).
4. La lógica accede directamente a modelos Mongoose de
   [`api/data/models.js`](../api/data/models.js). El middleware de errores
   traduce clases de `com` a respuestas HTTP.

Ya existe una separación entre rutas, handlers, lógica y modelos, pero no una
capa de repositorios independiente: las funciones de negocio consultan
Mongoose directamente. La verificación del JWT se repite en los handlers.

## Datos

- **Usuario:** nombre, correo, nombre de usuario, contraseña y referencias a
  recetas favoritas. Correo y nombre de usuario tienen índice único declarado.
- **Receta:** autor, título, imágenes, fecha, descripción, tiempo, dificultad,
  etiquetas, ingredientes, pasos y estado `published`. El título tiene índice
  único declarado.
- **Ingrediente y paso:** se definen como esquemas Mongoose y se insertan en
  arrays dentro de cada receta. El paso incluye un campo de orden.

La definición efectiva está en [`models.js`](../api/data/models.js). Las
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
[`users/index.js`](../api/routes/users/index.js) y
[`recipes/index.js`](../api/routes/recipes/index.js). No se ha generado ni
validado un contrato OpenAPI.

## Configuración y ejecución

La guía básica de instalación está en el [README principal](../README.md).
No se deben guardar credenciales en el repositorio.

| Variable | Uso en el código |
| --- | --- |
| `MONGO_URL` | Conexión de la API. |
| `PORT` | Puerto de escucha de la API. |
| `JWT_SECRET` | Firma y verificación de tokens. |
| `FRONTEND_URL`, `MAIL_FROM` | Enlace y remitente de recuperación de contraseña. |
| `NODE_ENV` | Selección del transporte y rama de envío de correo. En desarrollo debe establecerse explícitamente a `development` para usar la rama Ethereal. |
| `RESEND_API_KEY` | Proveedor Resend en producción. |
| `SPEC_MONGO_URL` | Base de datos usada por las pruebas `*.spec.js`. Debe ser exclusiva y desechable. |
| `TEST_MONGO_URL` | Usada por varios scripts de prueba manuales y por `data/populate.js`. |
| `MONGO_URL_PROD` | Usada por los scripts de actualización cuando se ejecutan en modo producción. |
| `VITE_API_URL` | URL de la API en el frontend. |

El correo de desarrollo utiliza Ethereal y requiere acceso a la red; el de
producción utiliza Resend. No se han validado aquí las credenciales ni los
servicios externos.

## Pruebas y calidad

- En `api`, `npm test` ejecuta Mocha sobre `logic/*.spec.js`; hay 22 archivos
  de ese tipo. Son pruebas de lógica con MongoDB real, no únicamente unitarias.
- **Precaución:** varias suites borran todos los usuarios y recetas de la base
  configurada en `SPEC_MONGO_URL` antes y después de cada prueba. Nunca apuntar
  esa variable a una base de desarrollo compartida o de producción.
- Los archivos `*.test.js` y `api/test/` son scripts separados; no forman parte
  del comando `npm test`. Algunos usan `MONGO_URL` o `TEST_MONGO_URL`: revisar
  cada script y su efecto antes de ejecutarlo.
- La prueba de recuperación de contraseña usa Ethereal. El script
  `test-coverage` genera cobertura de las suites seleccionadas; las imágenes
  o informes históricos no son una medida actual.
- En `app` existen `npm run lint` y `npm run build`; no se ha identificado una
  suite automatizada de frontend configurada en su `package.json`.
- No se ha identificado configuración de CI versionada en `.github/`.

No se ejecutaron pruebas ni compilaciones para este inventario. En particular,
no se ejecutaron pruebas de la API para evitar escribir en una base compartida
sin confirmar su aislamiento.

## Puntos a estudiar antes de la migración

- Decidir cómo mantener comportamiento, rutas, datos y despliegues durante la
  transición; no se ha elegido estrategia de migración todavía.
- Establecer una línea base de pruebas reproducible y aislada, incluyendo
  pruebas de integración HTTP y de los flujos importantes del frontend.
- Revisar seguridad: el JWT de sesión se firma sin expiración explícita,
  se almacena en `sessionStorage`, CORS está abierto por defecto y los errores
  incluyen `message` en respuestas 500. Son observaciones de código, no un
  diagnóstico de explotabilidad ni una auditoría.
- Revisar accesibilidad con teclado, lectores de pantalla, formularios,
  foco, contraste y diseño adaptable; no se ha realizado una auditoría WCAG.
- Medir rendimiento y experiencia real antes de fijar objetivos o proponer
  optimizaciones.

## Referencias para la arquitectura futura

El [ejemplo backend](https://github.com/DATW-2026/IFCD0210_2026/tree/main/14.Prisma_API)
organiza un módulo por entidades, repositorios, controladores y routers. Es
una referencia para la separación de responsabilidades, no una propuesta de
cambiar MongoDB a SQL ni de adoptar Prisma.
El [ejemplo frontend](https://github.com/DATW-2026/IFCD0210_2026/tree/main/10.Front)
organiza TypeScript por áreas funcionales. Vegazetas usa actualmente React,
mientras que el ejemplo no establece que deba mantenerse o sustituirse.
La elección concreta se acordará antes de redactar el plan de refactorización.

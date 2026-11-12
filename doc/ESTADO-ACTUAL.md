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

| Directorio        | Responsabilidad actual                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [`app/`](../app/) | SPA React 18 con React Router, Vite y Tailwind CSS, escrita en JavaScript y JSX.                                           |
| [`api/`](../api/) | API Express en JavaScript y TypeScript con módulos ES, Mongoose y MongoDB.                                                 |
| [`com/`](../com/) | Paquete local compartido de validaciones y clases de error; lo consumen `app` y `api` mediante `file:../com`.              |
| [`doc/`](./)      | Documentación e imágenes. Parte de la documentación anterior es histórica y puede no reflejar las funciones más recientes. |

Cada aplicación tiene su propio `package.json` y `package-lock.json`; no hay
un gestor de workspaces definido en la raíz. Los archivos `.node-version`
indican Node 26.13.1. El frontend ya utiliza Vite: no hace falta incorporarlo
para poder migrar a TypeScript.

Actualización del 12 de noviembre: `com` incorpora Zod para la validación de
etiquetas, títulos, descripciones, imágenes, dificultades y tiempos de recetas,
texto y notas de pasos, y cantidad, indicador principal, unidad y anotación de
ingredientes, además del nombre usado en registro e ingredientes, el nombre
de usuario, el correo, la contraseña, el identificador, el índice y la
dirección. Hay que instalar también sus dependencias; las validaciones aún no
migradas siguen en JavaScript. El alcance y las pruebas están en
[la migración de Zod](./MIGRACION-ZOD-SPRINT3.md).

## Recorrido de una petición

1. React monta la aplicación con `BrowserRouter`. Las vistas y componentes
   están en [`app/src/view/`](../app/src/view/), con rutas y estado compartido
   en `App.jsx` y `context.js`.
2. Las funciones de [`app/src/logic/`](../app/src/logic/) validan datos y usan
   `fetch` contra `VITE_API_URL`. El inicio de sesión guarda el JWT en
   `sessionStorage`.
3. [`api/index.js`](../api/index.js) conecta Mongoose a MongoDB y arranca la
   aplicación Express, que monta los routers de usuarios y recetas. La mayoría
   de rutas delega en handlers y funciones de [`api/logic/`](../api/logic/).
4. La mayoría de esa lógica accede directamente a modelos Mongoose de
   [`api/data/models.js`](../api/data/models.js). El middleware de errores
   traduce clases de `com` a respuestas HTTP.

Ya existe una separación entre rutas, handlers, lógica y modelos. La mayoría
de las funciones de negocio consultan Mongoose directamente; la consulta del
nombre de usuario es el primer corte con ruta, controlador, caso de uso y
repositorio independientes en TypeScript. El router de usuarios que integra
ese módulo sigue en JavaScript. La verificación del JWT se repite en los
handlers.

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

### Contratos observados en los handlers

Este resumen procede principalmente de la lectura del código; aún faltan
pruebas HTTP para la mayoría de las respuestas y errores.

| Operación | Entrada principal | Respuesta de éxito |
| --- | --- | --- |
| `POST /users` | `name`, `email`, `username`, `password` | `201`, sin cuerpo |
| `POST /users/auth` | `email`, `password` | `200`, token JWT como cadena JSON |
| `GET /users/name`, `GET /users/username` | Token de sesión | `200`, nombre o nombre de usuario como cadena JSON |
| `POST /users/password/recover` | `email` | `200`, objeto con mensaje |
| `POST /users/password/reset/:token` | Token en la ruta y `newPassword` | `204`, sin cuerpo |
| `PATCH /users/favorites/:recipeId` | Token de sesión e ID de receta | `200`, documento de usuario serializado sin `password` |
| `POST /recipes` | Token y campos de receta | `201`, ID como cadena JSON |
| `GET /recipes/my-recipes`, `/published-recipes`, `/favorites-recipes` | Token | `200`, lista de recetas |
| `GET /recipes/:recipeId` | Token e ID | `200`, receta con `own` e `isFavorite` |
| `PATCH /recipes/:recipeId` | Token, ID y campos editables | `204`, sin cuerpo |
| `DELETE /recipes/:recipeId` | Token e ID | `204`, sin cuerpo |
| `PATCH /recipes/:recipeId/publish` | Token e ID | `200`, objeto con `published` |
| Operaciones de ingredientes, pasos, imágenes y etiquetas | Token, ID y datos del elemento | `201` al añadir; `204` al modificar o eliminar. Las altas de ingrediente y paso devuelven un ID JSON. |

Los handlers protegidos extraen el token de `Authorization` y verifican el JWT.
El middleware traduce errores propios a `400`, `401`, `403`, `404`, `409` o
`500`; otros errores se convierten en `500`. Esto no garantiza que un token
inválido o ausente produzca `401`: hay que caracterizarlo por HTTP.

Las pruebas HTTP de `GET /users/name` confirman `200` con el nombre como
cadena JSON, `404` para un usuario inexistente y `400` para un ID de longitud
inválida. Un token con firma inválida o una cabecera ausente producen `500`
con `SystemError`, no `401`. Se conserva ese contrato por ahora; queda
pendiente acordar su corrección y revisar la exposición del mensaje de error.

**Corrección local pendiente de despliegue:** la respuesta de alternancia de
favoritos incluía el campo `password` con el hash. Se ha eliminado ese campo
sin cambiar los demás ni la contraseña almacenada. Una prueba HTTP con datos
ficticios comprobó el problema antes de la corrección y su ausencia después.

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
| `TEST_MONGO_URL`            | Usada por varios scripts de prueba manuales y por `data/populate.js`.                                                                          |
| `MONGO_URL_PROD`            | Usada por los scripts de actualización cuando se ejecutan en modo producción.                                                                  |
| `VITE_API_URL`              | URL de la API en el frontend.                                                                                                                  |

El correo de desarrollo utiliza Ethereal y requiere acceso a la red; el de
producción utiliza Resend. No se han validado aquí las credenciales ni los
servicios externos.

## Pruebas y calidad

- En `api`, `npm test` ejecuta secuencialmente con Vitest 22 suites en
  `logic/*.spec.js` y dos suites HTTP. Usan MongoDB real, no son únicamente
  unitarias. La configuración selecciona explícitamente las suites permitidas.
- **Precaución:** varias suites borran todos los usuarios y recetas de la base
  configurada en `SPEC_MONGO_URL` antes y después de cada prueba. Nunca apuntar
  esa variable a una base de desarrollo compartida o de producción.
- Los archivos `*.test.js` y los demás scripts de `api/test/` no forman parte
  del comando `npm test`. Algunos usan `MONGO_URL` o `TEST_MONGO_URL`: revisar
  cada script y su efecto antes de ejecutarlo.
- La suite normal de recuperación de contraseña usa un proveedor simulado.
  La prueba de integración con Ethereal es opcional y separada. El script
  `test-coverage` genera cobertura de las suites habituales de Vitest; los
  informes históricos no son una medida actual.
- Las suites solo aceptan la URI local documentada y conectan directamente;
  esta validación no demuestra por sí sola que la base sea desechable. Se
  reutiliza un contenedor dedicado y sus datos pueden borrarse en cada prueba.
- En `app` existen `npm run lint`, `npm run build` y `npm run test:e2e`. La
  suite Playwright prueba registro, sesión y credenciales incorrectas con
  Chromium y servicios locales; todavía no cubre los flujos de recetas.
- No se ha identificado configuración de CI versionada en `.github/`.

No se ejecutaron pruebas ni compilaciones para este inventario. En particular,
no se ejecutaron pruebas de la API para evitar escribir en una base compartida
sin confirmar su aislamiento.

## Línea base local del sprint 1

Comprobaciones realizadas el 11 de noviembre de 2026 en Windows, con
Node `24.22.1` y npm `11.19.1`. Describen esta instalación local, no los
entornos desplegados.

| Comprobación                                                | Resultado                                                                                                                                                                                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app`: `npm run lint`                                       | Falla: 6 errores y 6 advertencias. Hay una importación `useLocation` sin usar en `Home/index.jsx`, cinco errores de `__dirname` en `vite.config.js` y seis advertencias por dependencias de `useEffect`. Pendiente decidir su tratamiento. |
| `app`: `npm run build -- --outDir <directorio-temporal>`    | Correcto con Vite `4.5.14`; salida en un directorio temporal separado para no sobrescribir `app/dist`. Se transformaron 117 módulos.                                                                                                       |
| `api`: `npm test -- --ignore logic/passwordRecover.spec.js` | 78 pruebas correctas de 21 suites, con MongoDB `8.3.13` en un contenedor local desechable y `SPEC_MONGO_URL` establecido explícitamente a su puerto de localhost. El contenedor se eliminó después.                                        |
| `api`: `npm test` completo                                  | 83 pruebas correctas tras aislar el correo, con MongoDB local desechable. Las suites escriben y borran datos en `SPEC_MONGO_URL`.                                                                                                         |
| `com`: `npm test`                                           | No ejecutado: el script declarado solo informa que no hay pruebas y termina con error.                                                                                                                                                     |
| Frontend                                                    | No hay un script de pruebas automatizadas en su `package.json`; quedan pendientes los flujos de registro, sesión, recetas, publicación y favoritos.                                                                                        |
| HTTP y persistencia                                         | Hay una prueba HTTP para favoritos; la mayor parte de las suites prueba lógica con MongoDB. La autorización y los demás contratos necesitan caracterización adicional.                                                                      |

Después de aislar el correo, `npm test` pasó con **83 pruebas** en otro
contenedor local desechable. `npm run test-mail-integration` también pasó con
datos ficticios y Ethereal; se comprobó que rechaza una conexión remota de
MongoDB. Ambos contenedores se eliminaron al finalizar.

Tras corregir la respuesta de favoritos, `npm test` pasó con **83 pruebas de
Mocha y una prueba HTTP de Vitest**, secuencialmente y en un contenedor local
desechable. La corrección aún no se ha desplegado.

Posteriormente se corrigieron los seis errores de lint: `npm run lint` pasa con
seis advertencias de dependencias de `useEffect`. La compilación antes y después
produjo los mismos archivos con hashes SHA-256 idénticos. No se modificaron los
efectos: sus funciones y `alert` pueden cambiar de identidad entre renders, por
lo que añadir dependencias sin revisar podría repetir solicitudes. Queda
pendiente resolverlas con pruebas de los flujos.

Tras instalar Vitest, `npm audit` de la API informó de siete vulnerabilidades
en dependencias de desarrollo: una baja, cinco moderadas y una alta. La alta
afecta a `serialize-javascript`. `npm audit --omit=dev` no informó de
vulnerabilidades en dependencias de producción en esa ejecución. No se han
aplicado correcciones automáticas en esa ejecución.

Tras migrar las 22 suites a Vitest y retirar Mocha y c8, se comprobaron
**84 pruebas en 23 archivos**, tanto con `npm test` como con cobertura. La
integración opcional con Ethereal pasó por separado. Se verificó el rechazo de
una URI remota. Las pruebas utilizaron el contenedor dedicado reutilizable,
MongoDB `8.3.13`, con datos desechables. Después del cambio, `npm audit` y
`npm audit --omit=dev` no informaron de vulnerabilidades en la API.

Después del primer corte de `GET /users/name`, `npm test` pasó con **90
pruebas en 24 archivos** y `npm run typecheck` pasó para los módulos
TypeScript. También se comprobó el arranque real con Node `24.22.1`, la ruta
de salud y una petición autenticada, usando datos ficticios en el contenedor
de pruebas. Las rutas y handlers siguen en JavaScript; la lógica de nombre
de usuario y su repositorio son TypeScript. El paquete `com` sigue en
JavaScript y las partes no migradas no están completamente comprobadas por
tipos. La ejecución directa de TypeScript requiere Node `22.18.0` o posterior;
la política actual del proyecto es más restrictiva y se indica abajo.
`npm audit` no informó de vulnerabilidades en esa ejecución.

La primera suite Playwright pasó con **tres pruebas** en Chromium headless,
contra el frontend y la API locales y una base desechable distinta de la usada
por Vitest. Se comprobó el rechazo de una URI remota y la limpieza de los
usuarios sintéticos. El lint del frontend sigue pasando con seis advertencias
preexistentes. Al instalar Playwright, `npm audit` del frontend informó de dos
vulnerabilidades en dependencias de desarrollo existentes: una moderada en
esbuild y una alta en Vite. El cambio no actualizó esas dependencias; queda
pendiente su actualización coordinada.

Tras retirar `dotenv`, la API carga el archivo `.env` opcional del directorio
de trabajo mediante `process.loadEnvFile`: las variables existentes del proceso
tienen prioridad y los errores de lectura distintos de archivo ausente se
notifican. Se comprobó sin mostrar valores que el archivo local se interpreta
igual que con `dotenv` para sus variables actuales. Pasaron **93 pruebas de
Vitest**, incluida la prioridad de las variables y los casos de archivo ausente
y error de lectura; la integración opcional con Ethereal también pasó. Los dos
scripts de actualización se ejecutaron en modo de simulación contra una base
local desechable distinta, sin actualizar recetas.

El frontend se actualizó a Vite `8.3.8` y `@vitejs/plugin-react` `6.3.0`, que
como dependencias requieren Node `^20.19.0 || >=22.12.0`. Se conservan explícitamente los
anteriores objetivos de compilación de navegadores; no se ha probado cada
versión objetivo. Pasaron la compilación, lint con las seis advertencias
preexistentes y las tres pruebas de Playwright tanto con el servidor de
desarrollo como con la compilación de producción. `npm audit` no informó de
vulnerabilidades en API ni frontend en esa ejecución. Vite 8 cambia el
empaquetador y la transformación de código; los flujos no cubiertos por las
pruebas siguen necesitando validación.

La política actual para API y frontend admite Node `^22.23.5`, `^24.22.3` o
`^26.13.1`, con `26.13.1` como versión recomendada localmente. Cada paquete
activa `engine-strict` para que npm rechace motores incompatibles durante la
instalación; esto no comprueba el runtime al arrancar ni instala parches de
seguridad. Las versiones comunicadas de Netlify (`22.23.4`) y Render (`24.22.1`)
quedan por debajo de los nuevos mínimos: hay que verificar y coordinar su
actualización antes de desplegar. No se han modificado esos entornos. También
debe revisarse el soporte de las líneas y actualizar sus parches periódicamente.

Con Node `22.23.5`, `24.22.3` y `26.13.1` se comprobaron localmente, en cada
versión, la comprobación de motores de npm, tipos de la API, **93 pruebas Vitest**,
compilación del frontend y **tres pruebas Playwright**. Se reutilizó el
contenedor MongoDB desechable y se mantuvieron separadas las bases de Vitest y
Playwright. El lint con Node 26 pasó con las seis advertencias anteriores. El
Node global del equipo permanece en `24.22.1`; los README explican cómo
seleccionar Node 26 solo para una sesión de PowerShell.

Después se migró el corte `GET /users/name` completo a TypeScript y se
actualizó Express a `5.3.0`, con `@types/express` `5.0.6`. Se preservó el
comportamiento anterior de validación cuando el middleware JSON no procesa un
cuerpo; se comprobó el arranque real, la ruta de salud y que un puerto ocupado
se notifica como fallo de arranque.
Con cada una de las tres versiones de Node pasaron los tipos y **103 pruebas
Vitest en 26 archivos**; con Node 26 pasaron las **tres pruebas Playwright**.
`npm audit` de la API no informó de vulnerabilidades en esa ejecución. Estas
pruebas no cubren todos los contratos de las demás rutas.

Después se actualizaron Nodemailer a `10.5.0`, Resend a `6.38.0` y React Router
a `7.18.5`; se retiró la dependencia obsoleta `crypto` de npm, no utilizada por
el código, manteniendo el módulo nativo `node:crypto`. Las pruebas de
recuperación ejercitan Nodemailer con transporte en memoria y el SDK de Resend
con HTTP simulado: no demuestran entrega real. En Node 22, 24 y 26 pasaron
los tipos, **105 pruebas Vitest**, compilación y **tres pruebas Playwright**
por versión. El lint pasó con las seis advertencias anteriores; `npm audit`
no informó de vulnerabilidades en API ni frontend. No se ha modificado
producción.

**Riesgo pendiente:** el flujo actual no comprueba el campo `error` devuelto
por el SDK de Resend. Si el proveedor devuelve un error sin rechazar la
promesa, la API puede responder como si hubiera enviado el correo. Corregirlo
requiere acordar y probar el cambio de comportamiento.

Quedan actualizaciones pendientes: en la API, Mongoose 9 y los tipos de Node;
en el frontend, React y sus tipos, React Icons, ESLint y sus plugins, y Tailwind.
Deben abordarse por grupos compatibles. Los tipos de Node siguen en la línea
24: los de la 26 podrían permitir usar API ausentes en las versiones 22 y 24
admitidas, mientras que los actuales tampoco garantizan compatibilidad de tipos
con la 22. Hay que decidir esa política, no solo subir el número.

### Dependencias directas

Inventario histórico anterior a los cambios descritos arriba: versiones
instaladas obtenidas con `npm ls --depth=0`. Las versiones más
recientes corresponden al resultado de `npm outdated --depth=0` en esa fecha:
`=` indica que la dependencia no apareció como desactualizada. Esto no verifica
compatibilidad ni representa necesariamente las versiones desplegadas;
`com` es el paquete local.

| API                       | Instalada | Última  |
| ------------------------- | --------- | ------- |
| bcryptjs                  | 3.0.3     | =       |
| c8                        | 10.1.3    | 12.0.0  |
| chai                      | 5.3.3     | 6.3.0   |
| com                       | 1.0.0     | local   |
| cors                      | 2.8.6     | =       |
| crypto                    | 1.0.1     | =       |
| dotenv                    | 16.6.1    | 18.0.10 |
| express                   | 4.22.3    | 5.3.0   |
| jsonwebtoken              | 9.0.3     | =       |
| mocha                     | 11.8.0    | 12.0.3  |
| mongoose                  | 8.24.7    | 9.12.1  |
| monocart-coverage-reports | 2.13.2    | 3.2.1   |
| nodemailer                | 10.2.1    | 10.5.0  |
| resend                    | 6.35.0    | 6.38.0  |
| vitest                    | 5.1.0     | =       |

| Frontend                    | Instalada | Última  |
| --------------------------- | --------- | ------- |
| @types/react                | 18.3.31   | 19.3.0  |
| @types/react-dom            | 18.3.7    | 19.3.0  |
| @vitejs/plugin-react        | 4.7.0     | 6.3.0   |
| autoprefixer                | 10.6.2    | =       |
| clsx                        | 2.1.1     | =       |
| com                         | 1.0.0     | local   |
| eslint                      | 8.57.1    | 10.14.0 |
| eslint-plugin-react-hooks   | 4.6.2     | 7.1.1   |
| eslint-plugin-react-refresh | 0.4.26    | 0.5.7   |
| postcss                     | 8.5.32    | =       |
| react                       | 18.3.1    | 19.3.1  |
| react-dom                   | 18.3.1    | 19.3.1  |
| react-icons                 | 4.12.0    | 5.7.0   |
| react-router-dom            | 7.18.4    | 7.18.5  |
| tailwindcss                 | 3.4.19    | 4.3.5   |
| vite                        | 4.5.14    | 8.3.8   |

En la consulta inicial, la [descarga oficial de Node](https://nodejs.org/en/download)
ofrecía la versión `26.13.0`; los resultados posteriores se describen arriba.
Siguen pendientes pruebas de compatibilidad más amplias y la decisión sobre el
orden de las actualizaciones restantes.
También faltan detalles de los despliegues reales y un procedimiento de
recuperación aplicable al despliegue real.
El procedimiento local para repetir las suites con correo simulado está en
[`api/README.md`](../api/README.md); se ha ejecutado y ha restaurado las
variables de entorno del proceso al terminar.

#### Compatibilidad inicial de las actualizaciones

Requisitos consultados en los metadatos de npm para las versiones anteriores;
cumplirlos no garantiza que la aplicación funcione sin cambios:

- Vite `8.3.8` y su plugin React `6.3.0` requieren Node `^20.19.0` o
  `>=22.12.0`; el plugin requiere Vite `^8.0.0`. Deben actualizarse juntos.
  Vite 8 cambia las herramientas internas a Rolldown y Oxc; revisar también
  las migraciones intermedias desde la versión 4
  ([guía](https://vite.dev/guide/migration)).
- ESLint `10.14.0` requiere Node `^20.19.0`, `^22.13.0` o `>=24`.
  `eslint-plugin-react-refresh` `0.5.7` requiere ESLint 9 o 10, por lo que su
  actualización no debe separarse de la de ESLint.
- React DOM `19.3.1` requiere React `^19.3.1`; actualizar ambos y sus tipos de
  forma coordinada. La [guía de React 19](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
  exige la transformación JSX moderna. El proyecto ya usa `createRoot` y
  React 18.3, pero falta comprobar los demás cambios y flujos.
- Mongoose `9.12.1` requiere Node `>=20.19.0`; Express `5.3.0` requiere
  Node `>=18`. Las guías de [Mongoose 9](https://mongoosejs.com/docs/migrating_to_9.html)
  y [Express 5](https://expressjs.com/en/guide/migrating-5.html) recogen
  cambios incompatibles que deben contrastarse con el código y los contratos.
- Tailwind 4 modifica su integración con PostCSS y eleva los requisitos de
  navegador; consultar la [guía de actualización](https://tailwindcss.com/docs/upgrade-guide)
  antes de cambiar la configuración o el estilo.

Node local `24.22.1` y las versiones de Render y Netlify comunicadas por la
persona responsable cumplían esos requisitos de las dependencias, pero no
cumplen los nuevos mínimos del proyecto. Esto no sustituye las pruebas en los
entornos desplegados. Como orden orientativo, actualizar en
grupos compatibles y comprobar cada corte. La elección definitiva depende de
las pruebas, el soporte de navegadores y las migraciones documentadas.

### Entornos y protección de datos

Según la persona responsable, el frontend está en Netlify con Node `22.23.4`
para la compilación, la API en Render con Node `24.22.1` y el clúster de
MongoDB Atlas usa `8.0.37`. Son versiones comunicadas, no verificadas desde
esta sesión. No se ha modificado la versión de Netlify ni la de Render; ambas
requieren coordinación antes del despliegue. Quedan por confirmar
otras configuraciones y no se ha comprobado el estado de seguridad de esos
despliegues. El clúster es gratuito y, según la persona responsable, no se
muestran copias. Puede existir una base remota de pruebas,
pero su destino y aislamiento no se han verificado; se ha usado en su lugar
una instancia local desechable.

Se ha decidido partir de una base de producción vacía, inicialmente con el
esquema actual, sin migrar ni copiar los datos existentes. Cambiar la conexión
supondrá perder el acceso a las cuentas y recetas anteriores. La base actual
no se ha borrado ni se ha cambiado la conexión desplegada; ambas operaciones
requieren concretar y autorizar su ejecución.
Se ha elegido crear la nueva base en el clúster de Atlas existente y mantener
las pruebas en Docker. Según la persona responsable, se ha creado la base
`vegazetas_prod` con la colección `users`; se ha elegido ese nombre como
duradero. No se ha verificado mediante conexión ni se ha eliminado. La variable
`MONGO_URL` de la configuración
local apunta a una dirección local, no a Atlas; esto no determina qué conexión
usa Render. Se ha acordado aplazar el cambio de conexión de Render hasta el
despliegue; antes habrá que preparar y comprobar la reversión.

Docker Desktop se puso en marcha para las pruebas locales. `mongodump`,
`mongorestore` y `mongosh` no se encontraron en el PATH de Windows; la imagen
local `mongo:8` incluye `mongodump` y `mongorestore` `100.20.0`. No se ha
conectado a Atlas. El script `api/data/populate.js` también borra datos de
`TEST_MONGO_URL` y no debe ejecutarse sin verificar el destino.

La [documentación de Atlas para clústeres gratuitos](https://www.mongodb.com/docs/atlas/backup/cloud-backup/free-cluster-backup/)
describe una suscripción opcional de copias en vista previa privada y con
coste; puede no estar disponible en todos los clústeres.
[mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) es otra
opción para copias manuales. No se ha creado ninguna copia de la base actual;
la decisión posterior de empezar desde cero sustituyó el plan de copiarla.

#### Ensayo local de recuperación

Se ensayó `mongodump --db vegazetas_recovery_test --archive=... --gzip` y
`mongorestore --archive=... --gzip` con MongoDB `8.3.13` y herramientas
`100.20.0`. El origen y el destino fueron contenedores distintos, nuevos,
sin conexión de red y con datos exclusivamente ficticios. El archivo se
transfirió entre ellos a través de un directorio temporal local.

La restauración recuperó un usuario y una receta; se comprobaron los
recuentos, la referencia al autor, campos anidados y los tres índices únicos
de correo, nombre de usuario y título. Se eliminaron los dos contenedores y
el archivo temporal tras la prueba.

Esto comprueba una restauración local básica, no una copia consistente de
Atlas ni la recuperación de producción. Antes de usar este procedimiento con
datos reales hay que verificar versiones y permisos, cómo obtener una copia
consistente, almacenamiento privado y el destino de restauración separado;
no incluir credenciales en comandos o archivos versionados.

#### Procedimiento previsto para los nuevos datos de producción

Este procedimiento es una propuesta para después del cambio de conexión a
`vegazetas_prod`; no se ha ejecutado ni validado contra Atlas.

1. Identificar y verificar origen, permisos de lectura, versión y destino
   privado de la copia. No mostrar credenciales en comandos, registros o
   documentación. La carpeta ignorada por Git no es, por sí sola, un
   mecanismo de protección de acceso o cifrado.
2. Acordar la interrupción y detener **todas** las escrituras mientras se
   ejecuta `mongodump` para esa base. MongoDB advierte que una copia con
   escrituras concurrentes puede no corresponder a un instante coherente.
   Comprobar la finalización antes de reanudar las escrituras.
3. Guardar el archivo de copia con acceso restringido y registrar fecha,
   versión y resultado sin incluir datos ni secretos. Definir su conservación
   y una segunda ubicación segura antes de depender de él.
4. Verificar por separado el destino de ensayo, sus permisos y compatibilidad
   de versión; restaurar con `mongorestore` solo en ese destino. Comparar
   recuentos, índices y consultas representativas, y comprobar los flujos
   acordados sin exponer datos reales.
5. Para una recuperación real, acordar expresamente destino, interrupción y
   momento de restauración. Conservar evidencia del resultado y del alcance
   de datos que podrían perderse. Volver a la conexión anterior no recupera
   automáticamente los datos creados en la base nueva.

Referencias: [copias consistentes](https://www.mongodb.com/docs/database-tools/mongodump/mongodump-examples/)
y [restauración y compatibilidad](https://www.mongodb.com/docs/database-tools/mongorestore/).

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

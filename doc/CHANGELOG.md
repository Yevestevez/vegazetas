# Historial de versiones

Este historial describe versiones del producto completo. Las versiones de los
paquetes `api`, `app` y `com` son independientes. Una entrada aquí no implica
que exista una etiqueta de Git ni una publicación.

## Convención de versionado

El producto usa [versionado semántico](https://semver.org/lang/es/): `MAJOR.MINOR.PATCH`.

- **MAJOR** — cambios incompatibles con versiones anteriores.
- **MINOR** — funcionalidades nuevas compatibles con la versión anterior.
- **PATCH** — correcciones de errores compatibles.

Cada cambio actualiza este historial y el badge de versión
de los [README](../README.md). La versión más reciente aparece
encima; las anteriores, debajo.

## v2.3.4

Corrección de warnings de Tailwind CSS: clases arbitrarias reescritas con sintaxis canónica v4 y clases redundantes eliminadas.

### Cambios

- **Clases tipográficas faltantes:** añadidas `.anybody` y `.anybody-text` en `@layer components` de `main.css` para eliminar warnings de clases no definidas.
- **Sintaxis canónica en Menu:** clases `[&>:last-child]:...` reescritas como `*:last:...` en `Menu/index.tsx`.
- **Clases redundantes eliminadas:** `hover:outline` suprimido donde coexistía con `hover:outline-4` o `hover:outline-{color}` en `Menu`, `MyRecipes`, `SaveRecipe`, `PasswordReset`, `Alert` y `Confirm`.
- **Z-index canónico:** `z-[100]` reemplazado por `z-100` en `Alert` y `Confirm`.

### Archivos afectados

- `app/src/main.css`
- `app/src/view/Home/Menu/index.tsx`
- `app/src/view/Home/MyRecipes/index.tsx`
- `app/src/view/Home/SaveRecipe/index.tsx`
- `app/src/view/PasswordReset.tsx`
- `app/src/view/components/Alert.tsx`
- `app/src/view/components/Confirm.tsx`

## v2.3.3

Correcciones de seguridad: token de recuperación en path param, rate limiting global y headers CSP en Netlify.

### Cambios

- **Token de password recovery en path param:** el enlace de recuperación enviado por correo cambia de `/password-reset?token=...` a `/password-reset/...`, evitando que el token aparezca en los logs del servidor y el historial del navegador. Se actualizó la ruta de React Router y el componente `PasswordReset` para leer el token del path con `useParams`.
- **Rate limiting global:** se añade un límite de 100 peticiones por 15 minutos a todos los endpoints de la API, complementando los límites específicos de auth (5 por 15 min), password recovery (3 por hora) y password reset (5 por 10 min).
- **Headers de seguridad en Netlify:** se crea `_headers` en `app/public/` con Content Security Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer Policy y Permissions Policy para el frontend servido por Netlify.
- **Token en sessionStorage:** se mantiene el patrón actual (token JWT en `sessionStorage`); el riesgo XSS se mitiga con CSP tanto en la API (Helmet) como en el frontend (Netlify `_headers`).

### Resultados

- Vitest: **434 de 434 pruebas pasan**.
- Typecheck API y frontend: sin errores.

## v2.3.2

Corrección de fallos de pruebas Vitest: bug en limpieza de favoritos, serialización de `getRecipeById`, tests desactualizados y comparación de timestamps.

### Cambios

- **Bug `cleanUserFavorites`:** en `recipeRepo.ts` la función usaba `Recipe.updateMany` para borrar referencias de favoritos, pero `favorites` es un campo del modelo `User`. Corregido a `User.updateMany`.
- **`normalizeRecipe` en `getRecipeById`:** la función mutaba el documento Mongoose directamente, pero con Mongoose 9 `res.json()` usa `toJSON()` que omite los campos añadidos dinámicamente (`id`, `own`, `isFavorite`). Reescrita para crear un nuevo objeto plano.
- **Tests de imagen:** actualizados en `validateRecipeFields.spec.js` para usar el mensaje del schema (`'invalid image URL: must be a valid HTTPS URL from a public domain'`) y casos de prueba que el schema rechaza realmente (localhost, IPs privadas).
- **Tests de annotation:** actualizados en `validateIngredientFields.spec.js` con el límite correcto de 500 caracteres (el schema subió de 300 a 500 en v2.1.0).
- **Tests de ingredient name:** actualizado en `validateName.spec.js` con el límite correcto de 200 caracteres (el schema subió de 50 a 200 en v2.1.0).
- **Test de timestamps:** `updateRecipe.spec.js` excluía `updatedAt` de la comparación, ya que Mongoose lo actualiza automáticamente con `timestamps: true`.

### Resultados

- Vitest: **434 de 434 pruebas pasan** (antes 419 de 434).

## v2.3.1

Corrección del riesgo de Resend y reparación de las suites de validación de Vitest.

### Cambios

- **Resend error handling:** en `passwordRecover.ts` se comprueba el campo `error` del retorno de `transporter.emails.send()` y se lanza `SystemError` cuando el proveedor falla, evitando respuestas falsas de éxito. Se añadió el tipo `ResendResponse` y se convirtió el callback en `async` para usar `await`.
- **Suites de validación:** corregidos los imports en 7 archivos `test/validate*.spec.js` que apuntaban a rutas incorrectas de `app/src/logic/` (los módulos se reorganizaron en subdirectorios `auth/`, `recipes/`, etc.). Se configuró `VITE_API_URL` en `vitest.config.js` para que los módulos de frontend puedan construir URLs durante los tests. Las 7 suites que fallaban por import error ahora se importan correctamente.

## v2.3.0

Actualización de dependencias principales: Mongoose 9, ESLint 10 y tipos de Node 26.

### Cambios

- **Mongoose 9:** actualización de `^8.10.2` a `^9.0.1`. Se reemplazó la opción deprecada `new` por `returnDocument` en `recipeRepo.ts` y `userRepo.ts`. Los tests confirman compatibilidad: 178 de 182 pruebas pasan (4 fallos preexistentes).
- **ESLint 10:** actualización de `^8.53.0` a `^10.2.1`. Se añadieron `@eslint/js` y `globals` como devDependencies. Se eliminaron variables sin usar en `createRecipe.spec.js` y `navigation.spec.js` detectadas por la mayor estrictura de ESLint 10.
- **ESLint plugins:** `eslint-plugin-react-hooks` de `^4.6.0` a `^7.1.1` (soporte ESLint 10). `eslint-plugin-react-refresh` de `^0.4.4` a `^0.5.8` (ESM-only, soporte ESLint 10).
- **@types/node:** actualización de `^24.19.2` a `^26.6.6` en `api`, alineado con Node 26 del proyecto.

## v2.2.0

Pipeline de CI/CD con GitHub Actions y hooks locales con Husky.

### Cambios

- **CI en Pull Request:** workflow `ci.yml` con jobs paralelos (install, lint, typecheck, build, vitest, playwright) y MongoDB 8 como Docker service.
- **Hooks locales:** Husky con pre-commit que ejecuta lint del frontend y typecheck de API y frontend.
- **Documentación:** ESTADO-ACTUAL.md y READMEs actualizados; PLAN-REFACTORIZACION.md eliminado.

## v2.1.0-prev

Migración del esquema de modelos a la versión 2, ampliando los campos de Recipe y User, y ajustando validaciones y UI.

### Cambios

- **Esquema de Recipe ampliado:** compound index `{author, title}` único (reemplaza `title` único global), nuevos campos opcionales (`category`, `servings`, `source`, `sourceUrl`, `aiNotes`, `views`, `likes`, `likedBy`, `comments`, `nutrition`), `timestamps` automáticos, normalización de tags (`lowercase`, `trim`), nuevos índices para búsquedas y filtros.
- **Esquema de User ampliado:** campos `username` y `email` con `lowercase` y `trim`, nuevos campos opcionales (`bio`, `avatar`, `socialLinks`), `timestamps`.
- **Ingredient y Step embebidos:** ya no se registran como modelos MongoDB independientes; son subdocumentos de Recipe. Se eliminan los exports `Ingredient` y `Step` de `models.ts`.
- **Límites de validación subidos:** title 50→200, description 500→5000, step.text 800→5000, step.note 500→2000, ingredient.name 50→200, annotation 300→500.
- **Nuevas validaciones Zod:** schemas para `category`, `servings`, `source`, `sourceUrl`, `aiNotes`, `comment`, `nutrition`, `bio`, `avatar`, `socialLinks`.
- **Repositorios y casos de uso:** `createRecipe` y `recipeEdit` aceptan los campos nuevos; `getRecipeById` incrementa `views` con `$inc`; `deleteRecipe` limpia referencias de `favorites` y `likedBy`.
- **Handlers API:** `createRecipeHandler` y `recipeEditHandler` extraen y pasan los campos nuevos del body.
- **Tipos frontend:** `RecipeData` con todos los campos nuevos, nuevos tipos `Comment` y `Nutrition`.
- **Componentes UI:** `BasicDataForm` con select de categoría e input de porciones; `Recipe.tsx` muestra categoría, porciones, badge de fuente, contadores de vistas/likes y sección de nutrición.
- **Pruebas:** mensajes de error actualizados a los nuevos límites, nuevas pruebas para campos nuevos y limpieza referencial.

## v2.0.0

Versión final de la refactorización, desplegada en Netlify (frontend) y Render
(backend). API, frontend y paquete compartido son 100% TypeScript. Pasaron
**424 pruebas Vitest** en 27 archivos y **68 pruebas Playwright** en 11 archivos.

### Cambios

- **Refactorización completa a TypeScript:** toda la API, el frontend y el paquete compartido migrados a TypeScript con comprobación de tipos.
- **Express 5:** actualización a `5.3.0`, manteniendo el comportamiento del cuerpo JSON y los errores de autenticación.
- **Validación con Zod 4:** esquemas compartidos en `com` para etiquetas, títulos, descripciones, imágenes, dificultades, tiempos, pasos, ingredientes, nombre de usuario, correo, contraseña e identificadores.
- **Autenticación robusta:** todas las rutas protegidas devuelven `401` genérico ante credenciales inválidas y ocultan detalles de fallos internos; el frontend cierra la sesión coordinadamente.
- **Listas de recetas:** se añadió `isFavorite` a las recetas propias y se corrigió la autenticación de las tres listas (propias, publicadas, favoritas).
- **Efectos de React estabilizados:** se corrigieron las 9 advertencias de lint (menú, recetas y listas) sin recargar al mostrar avisos ni descartar cambios en el editor.
- **Dependencias actualizadas:** Nodemailer `10.5.0`, Resend `6.38.0`, React Router `7.18.5`, Vite `8.3.8`, plugin React `6.3.0`. Se retiró el paquete obsoleto `crypto` de npm.
- **Node LTS:** mínimos `22.23.5`, `24.22.3` y `26.13.1`, con `26.13.1` como referencia local.
- **Migración a Vitest:** las 22 suites de Mocha migradas a Vitest, ejecutándose secuencialmente sobre MongoDB local desechable.
- **Pruebas de navegador:** incorporación de Playwright para registro, inicio y cierre de sesión, con base desechable independiente de Vitest.
- **Seguridad:** protección contra JWT Algorithm Confusion, CORS configurable, errorHandler protegido en producción, proyección explícita de campos en favoritos.

El detalle de resultados y riesgos está en el [estado actual](./ESTADO-ACTUAL.md).

## v1.0.0

Punto de partida acordado para la aplicación existente en producción, con
cuentas, sesión y gestión de recetas. Marcada con el tag `v1.0.0` en Git.

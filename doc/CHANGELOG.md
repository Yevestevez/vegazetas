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

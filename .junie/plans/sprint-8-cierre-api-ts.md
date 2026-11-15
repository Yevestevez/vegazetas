---
sessionId: session-261115-142433-155r
---

# Contexto actual

El **Sprint 8** (cierre, seguridad y accesibilidad) está **en curso**. Lo completado hasta ahora:

- **`com/`** migrado 100% a TypeScript (errores, validación Zod, barrel exports).
- **Frontend (`app/src/`)** migrado 100% a TypeScript en 5 cortes. Tipos de receta centralizados en `app/src/types/recipe.ts`.
- **Módulos de API** (usuarios y recetas) ya en TypeScript con arquitectura por capas.

**Lo que queda en JavaScript en `api/`:**

| Archivo | Descripción |
|---|---|
| `api/app.js` | Creación de la app Express (middleware, routers, health). |
| `api/index.js` | Arranque de la API (connect DB, listen). |
| `api/config/loadEnv.js` | Carga de `.env`. |
| `api/data/models.js` | Esquemas Mongoose (User, Recipe, Ingredient, Step). |
| `api/data/populate.js` | Script de datos ficticios. |
| `api/logic/index.js` | Puente vacío (legacy). |
| `api/logic/*.test.js` (8 archivos) | Tests legacy de lógica migrada. |
| `api/middlewares/errorHandler.js` | Middleware de errores. |
| `api/middlewares/jsonBodyParser.js` | Middleware JSON body parser. |
| `api/routes/index.js` | Barrel export de routers. |
| `api/routes/users/index.js` | Router de usuarios (usa routers TS). |
| `api/routes/recipes/index.js` | Router de recetas (usa handlers TS). |
| `api/scripts/*.js` (2 archivos) | Scripts de actualización. |
| `api/test/*.js` (varios) | Scripts manuales de prueba. |
| `api/util/mailer.js` | Transporte de correo. |
| `api/vitest.config.js` | Config de Vitest. |

Los specs (`.spec.js`) se mantienen en JavaScript por decisión acordada.

# Propuesta: siguiente paso del Sprint 8

El siguiente paso es **migrar los archivos JS restantes de la API a TypeScript** para eliminar los puentes temporales y poder desactivar `allowJs` en `api/tsconfig.json`.

### Orden de migración (dependencias de abajo hacia arriba)

1. **`com/types/repo-types.ts` → tipos inferidos de Mongoose**: Reemplazar la interfaz intermedia `UserFavorites` por tipos inferidos de los modelos Mongoose una vez estos estén en TS.
2. **`api/data/models.js` → `api/data/models.ts`**: Migrar los esquemas Mongoose a TypeScript con tipos `InferSchemaType` o `Model` de Mongoose.
3. **`api/util/mailer.js` → `api/util/mailer.ts`**: Tipar el transporte de correo.
4. **`api/middlewares/*.js` → `api/middlewares/*.ts`**: Tipar con `RequestHandler` / `ErrorRequestHandler` de Express.
5. **`api/config/loadEnv.js` → `api/config/loadEnv.ts`**: Tipar la carga de `.env`.
6. **`api/routes/users/index.js` → `api/routes/users/index.ts`** y **`api/routes/recipes/index.js` → `api/routes/recipes/index.ts`**: Los routers ya importan módulos TS; solo necesitan tipado Express.
7. **`api/routes/index.js` → `api/routes/index.ts`**: Barrel export.
8. **`api/app.js` → `api/app.ts`**: Creación de la app Express.
9. **`api/index.js` → `api/index.ts`**: Arranque.
10. **Eliminar `api/logic/index.js`**: Puente vacío sin imports activos.
11. **Eliminar `api/logic/*.test.js`**: Tests de lógica ya migrada; la cobertura la proporcionan los specs HTTP.
12. **Desactivar `allowJs` en `api/tsconfig.json`**: Verificar que `tsc --noEmit` pasa sin JS.

### Qué NO se migra en este paso
- **Specs (`.spec.js`)**: Se mantienen en JS por decisión acordada.
- **Scripts manuales (`api/test/*.js`, `api/scripts/*.js`)**: Se pueden migrar en un paso posterior o dejar en JS si son solo de uso local.
- **`api/data/populate.js`**: Script de datos ficticios; migrar si se usa en pruebas.

### Validación
- `tsc --noEmit` en `api/` sin errores.
- Suite completa de Vitest: 423 pruebas pasan en 26 archivos, sin errores ni warnings.
- `vite build` en `app/` sin errores.
- Playwright E2E: pendiente de ejecutar.
- Fixes de tests: corregido `loadEnv.spec.js` (ya no usa `spawnSync` con `.js`, usa `loadEnvFile` directamente) y `getRecipeById.spec.js` (mock de `findById` con cadena `lean().exec()` completa).

# Delivery Steps

### ✓ Step 1: Migrar modelos Mongoose y utilidades a TypeScript
Migrar `api/data/models.js`, `api/util/mailer.js` y actualizar `com/types/repo-types.ts` para usar tipos inferidos de Mongoose.
- Convertir `api/data/models.js` a `models.ts` con esquemas tipados y export `Model` de Mongoose.
- Actualizar `com/types/repo-types.ts` para reemplazar `UserFavorites` por tipos inferidos.
- Migrar `api/util/mailer.js` a `mailer.ts` con tipado del transporte de correo.
- Verificar que los módulos TS de la API que importan modelos compilan sin errores.

### ✓ Step 2: Migrar middlewares, config y routers a TypeScript
Migrar los middlewares, la config y los routers de la API a TypeScript.
- `api/middlewares/errorHandler.js` → `errorHandler.ts` con `ErrorRequestHandler`.
- `api/middlewares/jsonBodyParser.js` → `jsonBodyParser.ts` con `RequestHandler`.
- `api/config/loadEnv.js` → `loadEnv.ts`.
- `api/routes/users/index.js` → `index.ts` y `api/routes/recipes/index.js` → `index.ts`.
- `api/routes/index.js` → `index.ts`.
- Verificar `tsc --noEmit` tras cada migración.

### ✓ Step 3: Migrar app.ts, index.ts y limpiar legacy
Migrar la creación y arranque de la app, eliminar puentes legacy y desactivar `allowJs`.
- `api/app.js` → `app.ts` con tipado de Express `Application`.
- `api/index.js` → `index.ts`.
- Eliminar `api/logic/index.js` (puente vacío sin imports activos).
- Eliminar `api/logic/*.test.js` (8 tests de lógica ya migrada; cobertura en specs HTTP).
- Desactivar `allowJs: true` en `api/tsconfig.json`.
- Ejecutar `tsc --noEmit`, suite Vitest completa y Playwright E2E para validar.
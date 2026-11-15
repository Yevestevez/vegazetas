---
sessionId: session-261115-120722-1xho
---

# Requirements

### Overview
Migrar el frontend de Vegazetas de JavaScript/JSX a TypeScript, manteniendo React 18 y Vite. El Sprint 7 se divide en 4 cortes funcionales, cada uno verificable de forma independiente.

### Scope

**In Scope (Sprint 7):**
- Configurar TypeScript en el frontend (`tsconfig.json`, actualizar `vite.config`)
- Migrar progresivamente los 62 archivos JS/JSX a TS/TSX en 4 cortes
- Tipar funciones de API, componentes React, contexto y utilidades
- Mantener compatibilidad temporal entre archivos TS y JS durante la transición

**Out of Scope:**
- Cambios de funcionalidad o diseño visual
- Migración de modelos Mongoose (Sprint 8)
- Revisión de seguridad y accesibilidad (Sprint 8)
- CI/CD (post-Sprint 8)

### 4 Cortes del Sprint 7

1. **Corte 1 — Base compartida y sesión** (en curso): configurar TypeScript, migrar `context.js`, `authenticatedFetch.js`, y funciones de sesión (`loginUser`, `logoutUser`, `isUserLoggedIn`, `getUserId`, `getUserName`, `getUserUsername`).
2. **Corte 2 — Formularios de autenticación**: `Login.jsx`, `Register.jsx`, `PasswordReset.jsx`, `Landing.jsx` y componentes comunes.
3. **Corte 3 — Listados de recetas**: `Home/Menu`, `MyRecipes`, `Discover`, `Favorites` y sus componentes.
4. **Corte 4 — Detalle y edición**: `Recipe` y `SaveRecipe` con elementos anidados.

### Acceptance Criteria
- Cada corte compila con `tsc --noEmit` y pasa `vite build`
- Las pruebas E2E existentes (Playwright) continúan pasando
- El código JS no migrado sigue funcionando sin errores en tiempo de ejecución

# Technical Design

### Current Implementation

**Frontend actual (`app/src/`):**
- 62 archivos `.js`/`.jsx`, 0 archivos `.ts`/`.tsx`
- Sin `tsconfig.json` en `app/`
- Ya tiene `@types/react` y `@types/react-dom` como devDependencies
- Vite configurado con alias (`@`, `@logic`, `@view`, `@util`, `@context`)
- React 18, React Router DOM 7, Tailwind CSS 3

**Archivos del Corte 1:**
- `context.js` — contexto global con `alert` y `confirm` (9 líneas)
- `authenticatedFetch.js` — wrapper de fetch con manejo de sesión expirada (27 líneas)
- `logic/loginUser.js` — validación + POST a `/users/auth` (37 líneas)
- `logic/logoutUser.js` — elimina token de sessionStorage
- `logic/isUserLoggedIn.js` — verifica existencia de token
- `logic/getUserId.js` — decodifica token para obtener userId
- `logic/getUserName.js` — GET a `/users/name`
- `logic/getUserUsername.js` — GET a `/users/username`
- `util/extractPayloadFromToken.js` — decodifica JWT
- `logic/index.js` — barrel export de todas las funciones de lógica

**Dependencias externas:**
- `com` (paquete compartido): `validate`, `errors` (clases de error como `CredentialsError`, `NotFoundError`, etc.)
- `sessionStorage` para el token JWT
- `import.meta.env.VITE_API_URL` para la URL de la API

### Key Decisions

1. **TypeScript config:** crear `app/tsconfig.json` con `moduleResolution: "bundler"` (compatible con Vite 8), `jsx: "react-jsx"`, `strict: true`, y `allowJs: true` para la transición gradual.
2. **Mantener `allowJs`:** permite que archivos JS y TS coexistan durante los 4 cortes. Se desactiva al cerrar el Sprint 7.
3. **Tipar `com` imports:** las funciones de `com/validate` y clases de `com/errors` están en JS. Se usarán con tipos implícitos hasta que `com` migre a TS (Sprint 3 ya migró parte a `com/schemas.ts`).
4. **Patrón de migración por archivo:** renombrar `.js` → `.ts` (o `.jsx` → `.tsx`), añadir tipos explícitos, corregir errores de compilación. No reestructurar la lógica.

### Proposed Changes

**Configuración:**
- Crear `app/tsconfig.json` con configuración estricta y `allowJs: true`
- Actualizar `app/vite.config.js` a `vite.config.ts` (opcional, Vite soporta ambos)

**Archivos a migrar (JS → TS):**
- `context.js` → `context.ts` (tipar `AppContext` con `{ alert, confirm }`)
- `authenticatedFetch.js` → `authenticatedFetch.ts` (tipar `RequestInfo`, `RequestInit`, `Response`)
- `util/extractPayloadFromToken.js` → `util/extractPayloadFromToken.ts`
- `logic/loginUser.js` → `logic/loginUser.ts`
- `logic/logoutUser.js` → `logic/logoutUser.ts`
- `logic/isUserLoggedIn.js` → `logic/isUserLoggedIn.ts`
- `logic/getUserId.js` → `logic/getUserId.ts`
- `logic/getUserName.js` → `logic/getUserName.ts`
- `logic/getUserUsername.js` → `logic/getUserUsername.ts`
- `logic/index.js` → `logic/index.ts` (actualizar imports)

**Verificación:**
- `tsc --noEmit` en `app/` (o `npx tsc --noEmit --project app/tsconfig.json`)
- `vite build` sin errores
- Las pruebas E2E existentes pasan

### Architecture Diagram

```
graph LR
    subgraph Frontend app/src
        context.ts
        authenticatedFetch.ts
        util/extractPayloadFromToken.ts
        subgraph logic
            loginUser.ts
            logoutUser.ts
            isUserLoggedIn.ts
            getUserId.ts
            getUserName.ts
            getUserUsername.ts
            index.ts
        end
    end
    com[com (JS)]
    API[API Express]
    context.ts --> authenticatedFetch.ts
    loginUser.ts --> authenticatedFetch.ts
    getUserName.ts --> authenticatedFetch.ts
    getUserId.ts --> util/extractPayloadFromToken.ts
    authenticatedFetch.ts --> API
    loginUser.ts --> com
    getUserName.ts --> com
```

### Risks
- **`com` en JS:** los imports de `com/validate` y `com/errors` no tienen tipos. Se usarán con tipos implícitos o se definirán interfaces intermedias si `strict` lo requiere.
- **`sessionStorage.token`:** TypeScript no conoce la propiedad `token` en `Window & typeof globalThis`. Se necesita una declaración de módulo o cast.
- **Alias de Vite:** los alias (`@`, `@logic`, etc.) deben reflejarse en `tsconfig.json` con `paths` para que TypeScript los resuelva.

# Delivery Steps

### ✓ Step 1: Configurar TypeScript en el frontend
Crear tsconfig.json y preparar el entorno para migrar archivos a TypeScript.
- Crear `app/tsconfig.json` con `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `strict: true`, `allowJs: true`, y `paths` para los alias de Vite (`@`, `@logic`, `@view`, `@util`, `@context`).
- Declarar extensión de `Window` para `sessionStorage.token` (declaración de módulo global).
- Verificar que `npx tsc --noEmit --project app/tsconfig.json` compila sin errores con los archivos JS actuales.

### ✓ Step 2: Migrar base compartida y funciones de sesión a TypeScript
Renombrar y tipar los archivos del corte 1: context, authenticatedFetch, util, y funciones de sesión.
- `context.js` → `context.ts`: tipar `AppContext` con `{ alert: Function, confirm: Function }`.
- `authenticatedFetch.js` → `authenticatedFetch.ts`: tipar parámetros y retorno de fetch, exportar `SESSION_EXPIRED_EVENT` como `const` tipado.
- `util/extractPayloadFromToken.js` → `util/extractPayloadFromToken.ts`: tipar el payload del JWT.
- `logic/loginUser.js` → `logic/loginUser.ts`: tipar parámetros (email, password), retorno (Promise<void>), y manejo de errores.
- `logic/logoutUser.js` → `logic/logoutUser.ts`.
- `logic/isUserLoggedIn.js` → `logic/isUserLoggedIn.ts`.
- `logic/getUserId.js` → `logic/getUserId.ts`.
- `logic/getUserName.js` → `logic/getUserName.ts`.
- `logic/getUserUsername.js` → `logic/getUserUsername.ts`.
- `logic/index.js` → `logic/index.ts`: actualizar imports a los archivos .ts.
- Verificar con `tsc --noEmit`, `vite build`, y pruebas E2E.
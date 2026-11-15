# Estructura del proyecto

Este documento muestra la estructura actual tras la refactorización (sprints 1–8
completados). Los árboles incluyen archivos representativos; `...` indica
contenido omitido, no un archivo real. No se muestran dependencias instaladas,
compilaciones, informes ni archivos locales de entorno.

## Estructura actual

```text
vegazetas/
├── .github/
│   └── skills/                      # Instrucciones y guías para agentes
├── api/                             # API Express y MongoDB (TypeScript)
│   ├── config/
│   │   └── loadEnv.ts               # Carga segura de .env
│   ├── data/
│   │   ├── models.ts                # Modelos Mongoose tipados
│   │   └── models.v2.ts             # Modelos versión alternativa
│   ├── middlewares/
│   │   ├── errorHandler.ts          # Traducción de errores a HTTP
│   │   ├── jsonBodyParser.ts        # Middleware JSON de Express
│   │   ├── rateLimiter.ts           # Limitación de peticiones
│   │   └── securityHeaders.ts       # Helmet y cabeceras de seguridad
│   ├── modules/                     # Módulos por capas (TypeScript)
│   │   ├── registerUser/
│   │   ├── authenticateUser/
│   │   ├── getUserName/
│   │   ├── getUserUsername/
│   │   ├── passwordRecover/
│   │   ├── passwordReset/
│   │   ├── toggleFavoriteRecipe/
│   │   ├── createRecipe/
│   │   ├── getRecipeById/
│   │   ├── recipeList/
│   │   ├── recipeEdit/
│   │   ├── togglePublishRecipe/
│   │   ├── recipeIngredients/
│   │   ├── recipeSteps/
│   │   ├── recipeImages/
│   │   └── recipeTags/
│   ├── routes/
│   │   ├── users/
│   │   │   └── index.ts             # Router de usuarios (TS)
│   │   ├── recipes/
│   │   │   └── index.ts             # Router de recetas (TS)
│   │   └── index.ts                 # Montaje de routers
│   ├── test/                        # Vitest specs y soporte E2E
│   │   ├── *.spec.js                # Specs de API (JS por decisión)
│   │   └── e2eServer.js, e2eDatabase.js, setup.js, testDatabase.js  # Soporte de pruebas
│   ├── util/
│   │   ├── mailer.ts                # Nodemailer y Resend tipados
│   │   ├── getSessionUserId.ts      # Extracción JWT
│   │   └── imageUrlValidator.ts     # Validación de URLs de imagen
│   ├── app.ts                       # Creación de la aplicación Express
│   ├── index.ts                     # Conexión MongoDB y arranque
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vitest.config.js             # Config Vitest (JS por decisión)
│   └── README.md
├── app/                             # Frontend React 19 y Vite 8 (TypeScript)
│   ├── e2e/                         # Pruebas de navegador con Playwright
│   ├── public/
│   ├── src/
│   │   ├── logic/                   # Acceso a la API y sesión (TS)
│   │   │   ├── index.ts             # Barrel export
│   │   │   ├── authenticatedFetch.ts
│   │   │   ├── loginUser.ts, logoutUser.ts, ...
│   │   │   └── funciones de recetas (TS)
│   │   ├── types/
│   │   │   └── recipe.ts            # Tipos compartidos de recetas
│   │   ├── util/
│   │   │   └── extractPayloadFromToken.ts
│   │   ├── view/
│   │   │   ├── Home/
│   │   │   │   ├── Discover/index.tsx
│   │   │   │   ├── Favorites/index.tsx
│   │   │   │   ├── Menu/index.tsx
│   │   │   │   ├── MyRecipes/index.tsx
│   │   │   │   ├── SaveRecipe/index.tsx
│   │   │   │   ├── common/          # Componentes compartidos (TSX)
│   │   │   │   │   ├── Recipe.tsx
│   │   │   │   │   └── ...
│   │   │   │   └── index.tsx
│   │   │   ├── common/              # Componentes globales (TSX)
│   │   │   │   ├── Input.tsx, Alert.tsx, Confirm.tsx, ...
│   │   │   │   └── ...
│   │   │   ├── helper/
│   │   │   │   ├── formatDate.ts
│   │   │   │   └── handleCredentialsError.ts
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── PasswordReset.tsx
│   │   │   └── Register.tsx
│   │   ├── App.tsx                  # Router principal React Router
│   │   ├── context.ts               # Contexto de aplicación
│   │   ├── main.tsx                 # Entry point con createRoot
│   │   ├── main.css                 # Estilos Tailwind
│   │   └── vite-env.d.ts            # Declaraciones globales Vite
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.js
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── README.md
├── com/                             # Código compartido (TypeScript)
│   ├── errors/
│   │   ├── index.ts                 # Barrel export de errores
│   │   ├── CredentialsError.ts
│   │   ├── DuplicityError.ts
│   │   ├── NotFoundError.ts
│   │   ├── OwnershipError.ts
│   │   ├── SystemError.ts
│   │   └── ValidationError.ts
│   ├── index.ts                     # Barrel export principal
│   ├── schemas.ts                   # Esquemas Zod de validación
│   ├── validate.ts                  # Validadores con Zod
│   ├── repo-types.ts                # Tipos de repositorio lean
│   ├── package.json                 # Zod 4.6.7 como dependencia
│   └── package-lock.json
├── doc/
│   ├── images/
│   ├── ESTADO-ACTUAL.md
│   ├── ESTRUCTURA-PROYECTO.md
│   ├── HISTORIAL-VERSIONES.md
│   └── PLAN-REFACTORIZACION.md
├── .gitignore
├── .node-version
├── AGENTS.md
├── README.md
├── README-EN.md
├── SECURITY-AUDIT-SUMMARY.md
├── SECURITY-CONFIG.md
├── SECURITY-REVIEW-CHANGES.md
└── skills-lock.json
```

La API está 100% en TypeScript con arquitectura por capas: cada módulo en
`modules/` contiene composición, caso de uso, handler y repositorio. Los routers
de usuarios y recetas (`routes/`) integran los módulos. Los directorios `logic/`
y `scripts/` se eliminaron al completar la migración. Los middlewares incluyen
seguridad (Helmet, rate limiting) y manejo de errores protegido en producción.

El frontend está 100% en TypeScript: componentes React funcionales, lógica de
acceso a la API tipada, y contexto de aplicación con alertas y confirmación.
React 19 y Vite 8 son los motores actuales.

El paquete compartido `com` está en TypeScript con Zod 4.6.7 para validación
de esquemas, clases de error tipadas y tipos de repositorio. Lo consumen `app`
y `api` mediante `file:../com`.

Los archivos que permanecen en JavaScript son por decisión: specs de Vitest,
soporte de pruebas y `vitest.config.js`.

Véase el [plan](./PLAN-REFACTORIZACION.md) para el estado y los criterios de
cada sprint, y el [estado actual](./ESTADO-ACTUAL.md) para detalles de
contratos, pruebas y configuración.

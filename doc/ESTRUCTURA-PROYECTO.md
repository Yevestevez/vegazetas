# Estructura del proyecto

Este documento muestra la estructura actual tras la refactorización (sprints 1–8
completados). Los árboles incluyen archivos representativos; `...` indica
contenido omitido, no un archivo real. No se muestran dependencias instaladas,
compilaciones, informes ni archivos locales de entorno.

## Estructura actual

```text
vegazetas/
├── .agents/
│   └── skills/                      # Instrucciones y guías para agentes
├── .github/
│   ├── skills/                      # Skills de referencia (Node, React, calidad, migración)
│   └── workflows/
│       └── ci.yml                   # Pipeline de CI en Pull Request
├── api/                             # API Express y MongoDB (TypeScript)
│   ├── config/
│   │   └── loadEnv.ts               # Carga segura de .env
│   ├── data/
│   │   ├── models.ts                # Modelos Mongoose tipados
│   │   └── repositories/
│   │       ├── index.ts             # Barrel export de repositorios
│   │       ├── recipeRepo.ts        # Repositorio lean de recetas
│   │       └── userRepo.ts          # Repositorio lean de usuarios
│   ├── middlewares/
│   │   ├── index.ts                 # Barrel export de middlewares
│   │   ├── errorHandler.ts          # Traducción de errores a HTTP
│   │   ├── jsonBodyParser.ts        # Middleware JSON de Express
│   │   ├── rateLimiter.ts           # Limitación de peticiones
│   │   └── securityHeaders.ts       # Helmet y cabeceras de seguridad
│   ├── modules/                     # Módulos por dominio y capas (TypeScript)
│   │   ├── recipes/
│   │   │   ├── index.ts             # Barrel export de módulos de recetas
│   │   │   ├── createRecipe/
│   │   │   ├── getRecipeById/
│   │   │   ├── recipeEdit/
│   │   │   ├── recipeImages/
│   │   │   ├── recipeIngredients/
│   │   │   ├── recipeList/
│   │   │   ├── recipeSteps/
│   │   │   ├── recipeTags/
│   │   │   └── togglePublishRecipe/
│   │   └── users/
│   │       ├── index.ts             # Barrel export de módulos de usuarios
│   │       ├── authenticateUser/
│   │       ├── getUserName/
│   │       ├── getUserUsername/
│   │       ├── passwordRecover/
│   │       ├── passwordReset/
│   │       ├── registerUser/
│   │       └── toggleFavoriteRecipe/
│   ├── routes/
│   │   ├── users/
│   │   │   └── index.ts             # Router de usuarios (TS)
│   │   ├── recipes/
│   │   │   └── index.ts             # Router de recetas (TS)
│   │   └── index.ts                 # Montaje de routers
│   ├── test/                        # Vitest specs y soporte E2E
│   │   ├── *.spec.js                # Specs de API (JS por decisión)
│   │   ├── *.sh                     # Scripts de prueba manual
│   │   └── e2eServer.js, e2eDatabase.js, setup.js, testDatabase.js  # Soporte de pruebas
│   ├── util/
│   │   ├── index.ts                 # Barrel export de utilidades
│   │   ├── mailer.ts                # Nodemailer y Resend tipados
│   │   ├── mailer.d.ts              # Declaraciones de tipos para mailer
│   │   ├── getSessionUserId.ts      # Extracción JWT
│   │   └── imageUrlValidator.ts     # Validación de URLs de imagen
│   ├── app.ts                       # Creación de la aplicación Express
│   ├── index.ts                     # Conexión MongoDB y arranque
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vitest.config.js             # Config Vitest (JS por decisión)
│   └── README.md
├── app/                             # Frontend React 19 y Vite (TypeScript)
│   ├── e2e/                         # Pruebas de navegador con Playwright
│   │   ├── authentication.spec.js
│   │   ├── createRecipe.spec.js
│   │   ├── editRecipe.spec.js
│   │   ├── ingredients.spec.js
│   │   ├── myRecipesActions.spec.js
│   │   ├── navigation.spec.js
│   │   ├── passwordRecovery.spec.js
│   │   ├── recipeActions.spec.js
│   │   ├── recipeLists.spec.js
│   │   ├── recipeTime.spec.js
│   │   └── steps.spec.js
│   ├── public/
│   │   └── _redirects               # Reglas de redirección Netlify
│   ├── src/
│   │   ├── logic/                   # Acceso a la API y sesión (TS)
│   │   │   ├── index.ts             # Barrel export principal
│   │   │   ├── authenticatedFetch.ts
│   │   │   ├── auth/
│   │   │   │   ├── index.ts         # Barrel export de auth
│   │   │   │   ├── getUserID.ts
│   │   │   │   ├── getUserName.ts
│   │   │   │   ├── getUserUsername.ts
│   │   │   │   ├── isUserLoggedIn.ts
│   │   │   │   ├── loginUser.ts
│   │   │   │   ├── logoutUser.ts
│   │   │   │   ├── passwordRecover.ts
│   │   │   │   ├── passwordReset.ts
│   │   │   │   ├── registerUser.ts
│   │   │   │   └── toggleFavoriteRecipe.ts
│   │   │   └── recipes/
│   │   │       ├── index.ts         # Barrel export de recetas
│   │   │       ├── createRecipe.ts
│   │   │       ├── deleteRecipe.ts
│   │   │       ├── getFavoriteRecipes.ts
│   │   │       ├── getMyRecipes.ts
│   │   │       ├── getPublishedRecipes.ts
│   │   │       ├── getRecipeById.ts
│   │   │       ├── togglePublishRecipe.ts
│   │   │       ├── updateRecipe.ts
│   │   │       ├── images/
│   │   │       │   ├── index.ts
│   │   │       │   ├── addImageToRecipe.ts
│   │   │       │   └── removeImageFromRecipe.ts
│   │   │       ├── ingredients/
│   │   │       │   ├── index.ts
│   │   │       │   ├── addIngredientToRecipe.ts
│   │   │       │   └── removeIngredientFromRecipe.ts
│   │   │       ├── steps/
│   │   │       │   ├── index.ts
│   │   │       │   ├── addStepToRecipe.ts
│   │   │       │   ├── removeStepFromRecipe.ts
│   │   │       │   ├── reorderStep.ts
│   │   │       │   └── updateStep.ts
│   │   │       └── tags/
│   │   │           ├── index.ts
│   │   │           ├── addTagToRecipe.ts
│   │   │           └── removeTagFromRecipe.ts
│   │   ├── types/
│   │   │   ├── index.ts             # Barrel export de tipos
│   │   │   └── recipe.ts            # Tipos compartidos de recetas
│   │   ├── util/
│   │   │   ├── extractPayloadFromToken.ts
│   │   │   ├── formatDate.ts
│   │   │   └── handleCredentialsError.ts
│   │   ├── view/
│   │   │   ├── components/          # Componentes globales (TSX)
│   │   │   │   ├── Alert.tsx
│   │   │   │   ├── CircleButton.tsx
│   │   │   │   ├── Confirm.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── LogoVegazetas.tsx
│   │   │   │   └── SectionTitle.tsx
│   │   │   ├── Home/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── Discover/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Favorites/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Menu/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── MenuButton.tsx
│   │   │   │   │   └── MenuHeader.tsx
│   │   │   │   ├── MyRecipes/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── SaveRecipe/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       ├── BasicDataForm.tsx
│   │   │   │   │       ├── ImageSection.tsx
│   │   │   │   │       ├── IngredientList.tsx
│   │   │   │   │       ├── NewIngredientForm.tsx
│   │   │   │   │       ├── NewStepForm.tsx
│   │   │   │   │       ├── PublishedStatus.tsx
│   │   │   │   │       ├── RecipeActionBar.tsx
│   │   │   │   │       ├── StepItem.tsx
│   │   │   │   │       ├── StepList.tsx
│   │   │   │   │       └── TagSection.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── Header.tsx
│   │   │   │       ├── LogoVegazetasHeader.tsx
│   │   │   │       ├── MiniCircleButton.tsx
│   │   │   │       ├── MyRecipeThumbnail.tsx
│   │   │   │       ├── ProfileImage.tsx
│   │   │   │       ├── Recipe.tsx
│   │   │   │       └── RecipeThumbnail.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── PasswordReset.tsx
│   │   │   └── Register.tsx
│   │   ├── App.tsx                  # Router principal React Router
│   │   ├── context.ts               # Contexto de aplicación
│   │   ├── main.css                 # Estilos Tailwind
│   │   ├── main.tsx                 # Entry point con createRoot
│   │   └── vite-env.d.ts            # Declaraciones globales Vite
│   ├── favicon.svg
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.js
│   ├── vite.config.ts               # Config Vite (TypeScript)
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
│   │   ├── ValidationError.ts
│   │   └── deserializeError.ts
│   ├── schemas/
│   │   ├── index.ts                 # Barrel export de schemas
│   │   ├── common.ts
│   │   ├── ingredient.ts
│   │   ├── recipe.ts
│   │   ├── step.ts
│   │   └── user.ts
│   ├── types/
│   │   └── repo-types.ts            # Tipos de repositorio lean
│   ├── index.ts                     # Barrel export principal
│   ├── schemas.ts                   # Esquemas Zod de validación (legacy)
│   ├── validate.ts                  # Validadores con Zod
│   ├── package.json                 # Zod como dependencia
│   └── package-lock.json
├── doc/
│   ├── images/
│   ├── next-features/
│   │   ├── PLAN-CLOUDINARY.md       # Plan de migración a Cloudinary
│   │   └── PLAN-IA-GEMINI.md        # Plan de integración con IA Gemini
│   ├── CHANGELOG.md                 # Historial de versiones semánticas
│   ├── DEPLOYMENT.md                # Configuración y problemas de despliegue
│   ├── ESTADO-ACTUAL.md
│   └── ESTRUCTURA-PROYECTO.md
├── .gitignore
├── .husky/
│   └── pre-commit                   # Hook de lint y typecheck
├── .node-version
├── AGENTS.md
├── LICENSE
├── package.json                     # Husky y scripts de raíz
├── README.md
├── README-EN.md
└── skills-lock.json
```

La API está 100% en TypeScript con arquitectura por capas: cada módulo en
`modules/` contiene composición, caso de uso, handler y rutas. Los módulos se
organizan por dominio (`recipes/` y `users/`) con barrel exports en `index.ts`.
Los routers de usuarios y recetas (`routes/`) integran los módulos. Los
repositorios lean (`data/repositories/`) separan el acceso a datos de los
modelos Mongoose. Los middlewares incluyen seguridad (Helmet, rate limiting)
y manejo de errores protegido en producción.

El frontend está 100% en TypeScript: componentes React funcionales, lógica de
acceso a la API tipada organizada en subdirectorios (`auth/`, `recipes/` con
`images/`, `ingredients/`, `steps/`, `tags/`), y contexto de aplicación con
alertas y confirmación. React 19 y Vite son los motores actuales. Los
componentes globales viven en `view/components/` y los compartidos por Home
en `view/Home/shared/`. Las pruebas E2E con Playwright cubren autenticación,
recetas, navegación y elementos de UI.

El paquete compartido `com` está en TypeScript con Zod para validación de
esquemas, clases de error tipadas (incluyendo `deserializeError`) y tipos de
repositorio. Los schemas se organizan en `schemas/` por entidad. Lo consumen
`app` y `api` mediante `file:../com`.

Los archivos que permanecen en JavaScript son por decisión: specs de Vitest,
soporte de pruebas, `vitest.config.js`, `playwright.config.js` y
`eslint.config.js`. Los scripts `.sh` en `api/test/` son para pruebas manuales.

Véase el [estado actual](./ESTADO-ACTUAL.md) para detalles de
contratos, pruebas y configuración, y la [guía de despliegue](./DEPLOYMENT.md)
para la configuración de Netlify y Render.

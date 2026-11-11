# Estructura del proyecto

Este documento muestra una vista simplificada de la estructura actual y una
propuesta orientativa para después de la refactorización. Los árboles incluyen
archivos representativos; `...` indica contenido omitido, no un archivo real.
No se muestran dependencias instaladas, compilaciones, informes ni archivos
locales de entorno.

## Estructura actual

```text
vegazetas/
├── .github/
│   └── skills/                      # Instrucciones y guías para agentes
├── api/                             # API Express y MongoDB
│   ├── data/
│   │   ├── models.js                # Modelos Mongoose
│   │   └── populate.js              # Script de datos
│   ├── logic/                       # Casos de uso y suites existentes
│   │   ├── getUserName.js           # Puente temporal al módulo TypeScript
│   │   ├── getUserName.spec.js
│   │   └── ...
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── jsonBodyParser.js
│   ├── modules/
│   │   └── users/
│   │       └── getUserName/         # Primer corte migrado
│   │           ├── getUserName.ts
│   │           └── userNameRepository.ts
│   ├── routes/
│   │   ├── users/
│   │   │   ├── handlers/
│   │   │   └── index.js
│   │   ├── recipes/
│   │   │   ├── handlers/
│   │   │   └── index.js
│   │   └── index.js
│   ├── scripts/                     # Scripts de actualización de datos
│   ├── test/                        # Pruebas HTTP y scripts manuales
│   ├── util/
│   │   └── mailer.js
│   ├── app.js                       # Creación de la aplicación Express
│   ├── index.js                     # Conexión y arranque de la API
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vitest.config.js
│   └── README.md
├── app/                             # Frontend React y Vite
│   ├── public/
│   ├── src/
│   │   ├── logic/                   # Acceso a la API y sesión
│   │   ├── util/
│   │   ├── view/
│   │   │   ├── Home/
│   │   │   │   ├── Discover/
│   │   │   │   ├── Favorites/
│   │   │   │   ├── Menu/
│   │   │   │   ├── MyRecipes/
│   │   │   │   ├── SaveRecipe/
│   │   │   │   ├── common/
│   │   │   │   └── index.jsx
│   │   │   ├── common/
│   │   │   ├── helper/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PasswordReset.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── context.js
│   │   ├── main.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
├── com/                             # Código compartido por API y frontend
│   ├── errors/
│   ├── index.js
│   ├── validate.js
│   ├── package.json
│   └── package-lock.json
├── doc/
│   ├── images/
│   ├── ESTADO-ACTUAL.md
│   ├── ESTRUCTURA-PROYECTO.md
│   └── PLAN-REFACTORIZACION.md
├── .gitignore
├── .node-version
├── AGENTS.md
├── README.md
└── README-EN.md
```

La API actual mezcla JavaScript con el primer módulo TypeScript. Su caso de
uso y repositorio son funciones, no clases; se conectan mediante un puente
temporal en `logic/`.

## Propuesta orientativa tras la refactorización

Esta estructura es un ejemplo para debatir, **no una estructura aprobada ni
implementada**. Los nombres, el nivel de separación y la ubicación de las
pruebas y contratos compartidos pueden cambiar durante la migración.

```text
vegazetas/
├── .github/
│   ├── skills/
│   └── workflows/                   # CI/CD: después de la refactorización
├── api/
│   ├── src/
│   │   ├── app.ts                   # Aplicación y composición
│   │   ├── index.ts                 # Arranque
│   │   ├── config/                  # Configuración validada
│   │   ├── shared/
│   │   │   ├── http/                # Autenticación y errores HTTP
│   │   │   └── infrastructure/      # Conexión MongoDB y correo
│   │   └── modules/
│   │       ├── users/
│   │       │   ├── domain/
│   │       │   │   └── UserRepository.ts       # Contrato del repositorio
│   │       │   ├── application/
│   │       │   │   ├── GetUserName.ts          # Caso de uso
│   │       │   │   └── ...
│   │       │   ├── infrastructure/
│   │       │   │   ├── MongooseUserRepository.ts
│   │       │   │   └── ...
│   │       │   └── http/
│   │       │       ├── users.routes.ts
│   │       │       ├── UserController.ts
│   │       │       └── ...
│   │       └── recipes/
│   │           ├── domain/
│   │           ├── application/
│   │           ├── infrastructure/
│   │           └── http/
│   ├── test/                        # Vitest: unidad e integración
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── README.md
├── app/
│   ├── public/
│   ├── src/
│   │   ├── app/                     # Composición, rutas y estado global
│   │   ├── features/
│   │   │   ├── auth/                # Registro, sesión y recuperación
│   │   │   ├── users/               # Datos de usuario
│   │   │   └── recipes/             # Listados, detalle, edición y favoritos
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── services/            # Comunicación HTTP común
│   │   │   └── utils/
│   │   ├── main.tsx
│   │   └── main.css
│   ├── test/                        # Vitest: componentes y lógica
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
├── com/                             # Contratos, errores y validaciones comunes
│   ├── src/
│   │   ├── contracts/
│   │   ├── errors/
│   │   └── validation/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── tests/
│   └── e2e/                         # Playwright: flujos completos
├── doc/
│   ├── ESTADO-ACTUAL.md
│   ├── ESTRUCTURA-PROYECTO.md
│   └── PLAN-REFACTORIZACION.md
├── AGENTS.md
├── README.md
└── README-EN.md
```

En la propuesta, una petición de la API recorrería la ruta y el controlador,
el caso de uso y el contrato del repositorio; una implementación Mongoose
accedería a MongoDB. La composición conectaría las implementaciones concretas.
El frontend mantendría componentes funcionales React.

Para usar POO de forma pragmática, `MongooseUserRepository` y, si aporta
claridad, `GetUserName` o `UserController` podrían ser clases. El contrato del
repositorio podría ser una interfaz TypeScript. Son opciones de diseño, no una
obligación de convertir todos los archivos o funciones en clases.

Playwright y los flujos de GitHub Actions todavía no están configurados. La
ubicación y formato de una futura documentación OpenAPI también quedan por
decidir. Véase el [plan](./PLAN-REFACTORIZACION.md) para el estado y los
criterios de cada sprint.

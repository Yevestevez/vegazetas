# Despliegue en Netlify y Render

Este documento registra la configuración y los problemas conocidos al desplegar
Vegazetas v2 en Netlify (frontend) y Render (backend).

## Arquitectura de despliegue

- **Frontend:** Netlify (`https://vegazetas.netlify.app`)
- **Backend:** Render (`https://vegazetas.onrender.com`)
- **Base de datos:** MongoDB Atlas (variable `MONGO_URL`)

## Paquete compartido `com/`

El paquete `com/` contiene código TypeScript compartido entre `api/` y `app/`:
esquemas Zod, clases de error y tipos. Ambos paquetes lo enlazan con
`"com": "file:../com"` en sus respectivos `package.json`.

**Problema:** Netlify y Render ejecutan `npm install` solo en el directorio
de construcción (`app/` o `api/`). No instalan las dependencias de `com/`,
por lo que los módulos importados desde `com/` (como `zod`) no se resuelven.

### Solución aplicada

Las dependencias de `com/` se duplican en los `package.json` de `api/` y
`app/`:

| Dependencia | `com/package.json` | `api/package.json` | `app/package.json` |
|---|---|---|---|
| `zod` | ✓ | ✓ | ✓ |
| `tsx` | | ✓ (en `dependencies`) | |

Si `com/` añade una dependencia, hay que duplicarla en `api/` y `app/`
según corresponda.

## Render (backend)

### Build command
```
cd ../com && npm install && cd ../api && npm install
```

El build command debe instalar las dependencias de `com/` antes de instalar
`api/`. Si solo ejecuta `npm i` desde `api/`, el enlace `file:../com` se
resuelve pero no se crea `com/node_modules`, y los imports de `com/` (como
`zod`) fallan en tiempo de ejecución.

### Start command
```
npm start
```
Ejecuta `tsx index.ts` (definido en `api/package.json`).

### tsx en dependencies
`tsx` debe estar en `dependencies`, no en `devDependencies`. Render no
instala `devDependencies` en producción. Si `tsx` está en
`devDependencies`, el despliegue falla con `tsx: not found` (status 127).

### Variables de entorno

| Variable | Requerida | Valor de ejemplo |
|---|---|---|
| `MONGO_URL` | Sí | `mongodb+srv://...` |
| `PORT` | Sí | Asignada por Render |
| `JWT_SECRET` | Sí | Secreto para tokens JWT |
| `FRONTEND_URL` | Sí | `https://vegazetas.netlify.app` |

`FRONTEND_URL` es obligatoria: la API la usa para configurar CORS de forma
segura y falla al arrancar sin ella.

### Node.js
El proyecto requiere Node.js 26 LTS. Render detecta la versión desde
`api/.node-version` o `engines.node` en `package.json`.

## Netlify (frontend)

### Build command
```
cd ../com && npm install && cd ../app && npm run build
```

El build command debe instalar las dependencias de `com/` antes de construir
`app/`. Si solo ejecuta `npm run build` desde `app/`, Vite no resolverá
`zod` al procesar `com/schemas.ts`.

### Publish directory
```
app/dist
```

### Variables de entorno

| Variable | Requerida | Valor de ejemplo |
|---|---|---|
| `VITE_API_URL` | Sí | `https://vegazetas.onrender.com` |

### Alias Vite para `com/`
El archivo `app/vite.config.ts` configura un alias `com` apuntando a
`../com` y `preserveSymlinks: true` para que Vite resuelva correctamente
las importaciones del paquete compartido.

### Node.js
Netlify detecta la versión desde `engines.node` en `app/package.json`
(`^26.13.1`). Si es necesario forzar la versión, añade la variable de
entorno `NODE_VERSION` con valor `26` en el panel de Netlify.

## Problemas conocidos y resolución

### `zod` no se resuelve en el build de Netlify

**Síntoma:** `Rolldown failed to resolve import "zod" from
"/opt/build/repo/com/schemas.ts"`.

**Causa:** `com/` importa `zod`, pero Netlify no instala las dependencias
de `com/`.

**Solución:** Asegurar que `zod` esté en `app/package.json` y que el build
command instale `com/` (`cd ../com && npm install && ...`).

### `tsx: not found` en Render

**Síntoma:** `sh: 1: tsx: not found` (status 127).

**Causa:** `tsx` estaba en `devDependencies`; Render no las instala.

**Solución:** Mover `tsx` a `dependencies` en `api/package.json`.

### `ERR_MODULE_NOT_FOUND: Cannot find package 'zod'` en Render

**Síntoma:** La API falla al arrancar con `Cannot find package 'zod'
imported from /opt/render/project/src/com/schemas.ts`.

**Causa:** Render ejecuta `npm i` solo en `api/`. Aunque `com` se enlaza con
`file:../com`, no se crea `com/node_modules`. Cuando `com/schemas.ts` importa
`zod`, Node.js lo busca en `com/node_modules` y no lo encuentra. Añadir `zod`
a `api/package.json` no es suficiente: el resolutor de módulos busca desde el
contexto de `com/`, no desde `api/`.

**Solución:** Cambiar el build command de Render a
`cd ../com && npm install && cd ../api && npm install` para que se creen
`com/node_modules` antes de instalar `api/`.

## Orden de despliegue después de un merge a `main`

1. Verificar que `api/package.json` y `app/package.json` incluyen las
   dependencias de `com/` (`zod`, `tsx`).
2. Render se reinicia automáticamente al detectar cambios en `main`.
   Asegurar que `FRONTEND_URL` esté configurada.
3. Netlify se reinicia automáticamente. Verificar que el build command
   instale `com/` antes de construir.
4. Probar el endpoint `/health`: `https://vegazetas.onrender.com/health`
   debería devolver `ok`.
5. Probar el frontend en `https://vegazetas.netlify.app`.

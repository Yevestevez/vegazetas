# Plan de integración de Cloudinary

## Contexto

Actualmente, Vegazetas almacena imágenes de recetas como **URLs externas** que el usuario
pega manualmente en un campo `type="url"` del formulario (`SaveRecipe/index.tsx`).
El backend valida que sea una URL pública (`com/schemas.ts` → `imageSchema`) y la
almacena como string en el array `images` del documento Recipe.

Este enfoque funciona pero tiene limitaciones:
- Las imágenes dependen de servicios externos que pueden desaparecer.
- No hay control sobre tamaño, formato o calidad.
- No se optimizan para diferentes dispositivos.
- No hay subida directa de archivos desde la app.

Cloudinary resuelve estos problemas con almacenamiento propio, transformaciones
automáticas y un CDN integrado. Su plan gratuito es suficiente para una app
en crecimiento.

---

## Cloudinary Free Tier

| Recurso | Límite | Equivalencia |
|---------|--------|--------------|
| Créditos/mes | 25 | Compartidos entre storage, bandwidth y transformaciones |
| Storage | 1 crédito = 1 GB | Hasta 25 GB |
| Bandwidth | 1 crédito = 1 GB | Hasta 25 GB |
| Transformaciones | 1 crédito = 1.000 | Hasta 25.000 |
| Tarjeta de crédito | No requerida | - |
| Ventana de cálculo | 30 días rodantes | No se resetea el primer del mes |

**Qué pasa si se agotan los créditos:** Cloudinary envía notificaciones
solicitando upgrade. Si no se actúa, la cuenta se deshabilita. **No se genera
ningún cargo automático** sin tarjeta de crédito.

**Cálculo para Vegazetas:**
- Suponiendo 100 recetas con 2 imágenes cada una = 200 imágenes originales.
- Imagen promedio: 500 KB → 200 × 500 KB = 100 MB de storage (~0.1 créditos).
- Cada transformación (redimensionar, cambiar formato) consume 1 de 1.000.
- Si cada imagen se sirve en 3 variantes (thumbnail, medium, original): 200 × 3 = 600 transformaciones (0.6 créditos).
- Bandwidth: si 100 usuarios/mes ven las recetas, ~5 GB (5 créditos).
- **Total estimado: ~6 créditos/mes** de 25 disponibles. Margen amplio.

---

## Qué cambia y qué no

### No cambia
- **Esquema de MongoDB:** `images` sigue siendo `[{ type: String }]`. Cloudinary
  devuelve URLs, igual que ahora. Mismo campo, mismo tipo.
- **`step.image`:** también sigue siendo `type: String`.
- **`user.avatar`:** campo nuevo en `models.v2.ts`, también `type: String`.
- **Contratos de API:** los endpoints existentes de imágenes (`POST /:recipeId/images`,
  `DELETE /:recipeId/images/:index`) mantienen sus respuestas.

### Cambia
- **Flujo de subida:** en lugar de pegar URLs, el usuario selecciona archivos
  desde el dispositivo. El frontend los envía al backend, que los sube a Cloudinary
  y obtiene la URL.
- **Nuevo endpoint:** `POST /upload/image` para recibir archivos y devolver URLs.
- **Eliminación:** al borrar una imagen de una receta, también se elimina el
  recurso de Cloudinary para liberar storage.
- **Transformaciones automáticas:** Cloudinary genera thumbnails y variantes
  optimizadas (WebP, resize) mediante URL, sin código adicional.

---

## Arquitectura

```mermaid
graph LR
    A[Frontend: seleccionar archivo] --> B[POST /upload/image]
    B --> C[uploadHandler]
    C --> D[cloudinaryService.upload()]
    D --> E[Cloudinary API]
    E --> F[URL de imagen]
    F --> G[Devolver URL al frontend]
    G --> H[Frontend: llamar POST /recipes/:id/images con la URL]
    H --> I[Recipe.images.push(url)]
    
    J[Frontend: eliminar imagen] --> K[DELETE /recipes/:id/images/:index]
    K --> L[Obtener URL anterior]
    L --> M[cloudinaryService.destroy()]
    M --> N[Cloudinary: borrar recurso]
    L --> O[Recipe.images.splice(index)]
```

**Flujo de subida:**
1. Usuario selecciona archivo en el formulario (`SaveRecipe/index.tsx`).
2. Frontend envía `multipart/form-data` a `POST /upload/image`.
3. Backend valida tipo y tamaño del archivo.
4. Backend sube a Cloudinary con `cloudinary.v2.uploader.upload()`.
5. Cloudinary devuelve la URL pública.
6. Backend devuelve la URL al frontend.
7. Frontend llama al endpoint existente `POST /recipes/:recipeId/images` con la URL.
8. La URL se almacena en `Recipe.images` como antes.

**Flujo de eliminación:**
1. Usuario elimina imagen de una receta.
2. Backend obtiene la URL anterior para extraer el `public_id` de Cloudinary.
3. Backend llama a `cloudinary.v2.uploader.destroy(public_id)`.
4. Backend elimina la URL del array `images` de la receta.

---

## Archivos a crear/modificar

### Backend (api/)

| Archivo | Acción |
|---------|--------|
| `api/services/cloudinary.ts` | **Nuevo.** Servicio que envuelve el SDK de Cloudinary: subir, eliminar, extraer public_id desde URL. |
| `api/modules/upload/uploadImage.ts` | **Nuevo.** Caso de uso: validar archivo, llamar a cloudinaryService, devolver URL. |
| `api/modules/upload/uploadImageHandler.ts` | **Nuevo.** Handler Express que recibe `multipart/form-data`, extrae archivo, llama al use case. |
| `api/modules/upload/composition.ts` | **Nuevo.** Enlaza handler → use case → service. |
| `api/routes/upload/index.ts` | **Nuevo.** Router con `POST /image`. |
| `api/routes/index.ts` | **Modificar.** Montar router de upload. |
| `api/modules/recipes/recipeImages/recipeImagesRepository.ts` | **Modificar.** En `createRemoveImage`, devolver la URL eliminada para que el use case pueda borrar de Cloudinary. |
| `api/modules/recipes/recipeImages/recipeImages.ts` | **Modificar.** Llamar a cloudinaryService.destroy() con la URL eliminada. |
| `api/package.json` | **Modificar.** Añadir dependencias: `cloudinary`, `multer` (para multipart/form-data). |
| `com/schemas.ts` | **Opcional.** Añadir `cloudinaryUrlSchema` para validar URLs de Cloudinary si se quiere restringir a ese provider. |

### Frontend (app/)

| Archivo | Acción |
|---------|--------|
| `app/src/logic/uploadImage.ts` | **Nuevo.** Función que envía `FormData` con el archivo a `POST /upload/image`, devuelve la URL. |
| `app/src/logic/index.ts` | **Modificar.** Exportar `uploadImage`. |
| `app/src/view/Home/SaveRecipe/index.tsx` | **Modificar.** Reemplazar formulario de URL por input `type="file"` con preview. Llamar a `uploadImage` antes de añadir la imagen. |
| `app/src/types/recipe.ts` | Sin cambios. `images` sigue siendo `string[]`. |

### Configuración

| Archivo | Acción |
|---------|--------|
| `.env` del backend | Añadir `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. |
| `api/config/loadEnv.ts` | **Opcional.** Validar que las variables de Cloudinary existen si se quiere fail-fast. |

---

## Dependencias nuevas

| Paquete | Propósito | Versión |
|---------|-----------|---------|
| `cloudinary` | SDK oficial para subir, transformar y eliminar recursos. | Última estable compatible con Node 26 LTS. |
| `multer` | Middleware de Express para parsear `multipart/form-data` (archivos). | Última estable compatible con Express 5. |
| `@types/multer` | Tipos TypeScript para multer. | Última estable. |

---

## Límites y validaciones

### Subida de archivos
- **Tipos permitidos:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- **Tamaño máximo:** 5 MB por archivo (configurable con `multer.limit.fileSize`).
- **Máximo por receta:** mantener el límite existente (2 imágenes en repository, 15 en use case — revisar discrepancia).
- **Validación en backend:** verificar `file.mimetype` contra la lista permitida.
- **Validación en frontend:** mostrar tipos aceptados y tamaño máximo en el input.

### Transformaciones
Cloudinary permite transformaciones directamente en la URL:
- **Thumbnail:** `w_200,h_200,c_fill` para miniaturas en listados.
- **Medium:** `w_800,q_auto,f_auto` para vista de detalle.
- **Original:** sin transformaciones, para descarga.

Ejemplo de uso en el frontend:

```
// URL original almacenada:
// https://res.cloudinary.com/demo/image/upload/v123/recipe1.jpg

// Thumbnail (200x200, recorte centrado):
// https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/v123/recipe1.jpg

// Optimizada (WebP automático, calidad automática, 800px ancho):
// https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/v123/recipe1.jpg
```

No se necesita código backend para las transformaciones; se construyen las URLs
en el frontend o con el SDK de Cloudinary (`cloudinary.url()`).

---

## Extracción de public_id desde URL

Cloudinary devuelve URLs como:
`https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>`

El servicio `cloudinary.ts` debe extraer el `public_id` (sin extensión) para
poder eliminar el recurso. Ejemplo:

```
// URL: https://res.cloudinary.com/demo/image/upload/v1234567890/vegazetas/recipe1.jpg
// public_id: vegazetas/recipe1
```

Se recomienda usar el parámetro `upload_preset` con un prefijo (`vegazetas/`)
para identificar los recursos de la app y evitar borrar recursos ajenos.

---

## Orden de implementación

1. **Configurar Cloudinary:** crear cuenta, obtener credenciales, añadir a `.env`.
2. **Instalar dependencias:** `cloudinary`, `multer`, `@types/multer` en `api/`.
3. **Crear servicio cloudinary.ts:** configurar SDK, funciones upload y destroy.
4. **Crear módulo upload:** handler, use case, composition para `POST /upload/image`.
5. **Registrar ruta:** montar router de upload en `api/routes/index.ts`.
6. **Actualizar recipeImages:** llamar a cloudinaryService.destroy() al eliminar.
7. **Actualizar frontend:** reemplazar input de URL por input de archivo con preview.
8. **Actualizar populate.js:** opcional, usar URLs de Cloudinary en datos de prueba.
9. **Actualizar pruebas:** añadir specs para upload y eliminación con Cloudinary.

---

## Migración de imágenes existentes

Si hay recetas con URLs externas ya almacenadas:
- **Opción A (recomendada):** dejar las URLs externas como están. Solo las nuevas
  imágenes se suben a Cloudinary. Las URLs siguen funcionando mientras el origen
  externo exista.
- **Opción B:** migrar manualmente las imágenes importantes subiéndolas a Cloudinary
  y actualizando las URLs en MongoDB. Solo si las URLs externas son inestables.

Dado que la base de producción está vacía, no hay imágenes que migrar.

---

## Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Agotar créditos del free tier | Imágenes no accesibles | Monitorizar uso en Cloudinary Console. ~6 créditos/mes estimados vs 25 disponibles. |
| Archivo malicioso subido | Seguridad | Validar mimetype y tamaño en multer. Cloudinary escanea automáticamente. |
| Cloudinary inactivo | Imágenes rotas | Configurar timeout y retry. Mostrar placeholder en frontend. |
| URLs externas mezcladas con Cloudinary | Transformaciones inconsistentes | Las URLs externas no soportan transformaciones de Cloudinary. Detectar por patrón de URL y aplicar transformaciones solo a URLs de Cloudinary. |

---

## Decisiones pendientes

- **Tamaño máximo de archivo:** 5 MB propuesto. Ajustar según necesidades.
- **Formatos permitidos:** JPEG, PNG, WebP, GIF propuestos. Añadir más si es necesario.
- **Transformaciones en frontend vs backend:** las transformaciones se aplican
  construyendo URLs. Decidir si el frontend construye las URLs directamente o
  llama a un endpoint que las genere.
- **Avatar de usuario:** usar el mismo endpoint `POST /upload/image` o crear
  uno específico con configuraciones distintas (tamaño, crop, etc.).
- **Imágenes de pasos (`step.image`):** usar el mismo flujo de subida o mantener
  URLs externas para pasos.

---

## Notas

- Cloudinary añade un watermark en las imágenes del plan gratuito. Verificar
  si es aceptable para la app.
- El SDK de Cloudinary para Node.js es sincrónico en la configuración y
  asíncrono (callbacks/promises) en las operaciones de subida. Envolver en
  Promises para usar con async/await.
- Multer almacena los archivos en memoria (`multer.memoryStorage()`) antes de
  subirlos a Cloudinary. Con límite de 5 MB, el impacto en memoria es mínimo.
- No se necesita cambiar `models.ts` ni `models.v2.ts`: los campos de imagen
  ya son strings (URLs).
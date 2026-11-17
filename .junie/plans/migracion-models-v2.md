---
sessionId: session-261117-185031-1d5f
---

# Resumen y Decisión

## Decisión tomada: límites de Zod

**Se subirán los límites de Zod para alinearse con el esquema v2.**

| Campo | Zod actual | Nuevo límite (Zod + Schema v2) |
|-------|-----------|--------------------------------|
| title | 50 | 200 |
| description | 500 | 5000 |
| step.text | 800 | 5000 |
| step.note | 500 | 2000 |
| ingredient.name | 50 | 200 |

Rationale: el frontend debe aceptar los mismos valores que el esquema permite. Los componentes UI pueden mantener límites visuales más bajos (maxLength en HTML) como guía, pero la validación no será más restrictiva que la base de datos.

## Estimación de coste y dificultad

### Complejidad general: **Media**

No es un cambio trivial (toca 3 paquetes y ~20 archivos), pero tampoco es de alta complejidad arquitectónica: no hay migración de datos (base vacía), no se cambia el framework ni la arquitectura, y los nuevos campos son opcionales (backwards compatible).

### Desglose por área

| Área | Archivos | Líneas estimadas | Dificultad | Riesgo |
|------|----------|-----------------|------------|--------|
| 1. Modelos (models.ts) | 1 | ~140 reemplazo | Baja | Media (bloquea todo) |
| 2. Zod + com | 3 | ~80 nuevas | Baja | Baja |
| 3. Repositorios + casos de uso | 6 | ~100 cambios | Media | Media (lógica de negocio) |
| 4. Handlers API | 2 | ~20 cambios | Baja | Baja |
| 5. Tipos + lógica frontend | 3 | ~40 cambios | Baja | Baja |
| 6. Componentes UI | 2-4 | ~100 nuevas | Media | Baja |
| 7. Pruebas | 5 | ~150 cambios | Media | Media (regresiones) |
| **Total** | **~22 archivos** | **~500 líneas** | | |

### Estimación de tiempo

- **Fase 1 (backend core)**: áreas 1–4 → cambios puramente estructurales, seguir el patrón existente. ~2-3h de trabajo.
- **Fase 2 (frontend)**: áreas 5–6 → añadir UI nueva, seguir patrones existentes. ~2-3h.
- **Fase 3 (pruebas)**: área 7 → actualizar specs y añadir nuevas. ~1-2h.
- **Total estimado**: ~5-8h de trabajo autónomo.

### Riesgos identificados

1. **getRecipeById con $inc**: actualmente usa `.lean()` (lectura pura). Para incrementar views se necesita `.findOneAndUpdate()` sin lean. Impacto: cambio en el repositorio y posible cambio en serialización.
2. **Limpieza referencial de likedBy**: al borrar una receta hay que limpiar `likedBy` de todas las recetas (no de usuarios — `likedBy` vive en Recipe, no en User). El plan original menciona limpiar de User, pero `likedBy` es array de ObjectId en Recipe. Necesita revisión.
3. **Tests de límites**: los mensajes de error cambian ("50 characters" → "200 characters"). Hay que actualizar todos los asserts.
4. **populate.js no existe**: el plan menciona actualizarlo, pero no hay archivo. Se omite.

### Qué NO se incluye (sprints futuros)

- Nuevos endpoints (likes, comentarios, búsqueda avanzada, perfil de usuario).
- Componente de perfil de usuario.
- Integración con IA (source, sourceUrl, aiNotes se preparan pero no se usan en el formulario inicial).

# Delivery Steps

### ✓ Step 1: Migrar esquema de modelos (models.ts)
Reemplazar models.ts por models.v2.ts como capa base de datos. Es el paso crítico que desbloquea todo lo demás.

- Renombrar models.v2.ts a models.ts (o reemplazar el contenido).
- Los cambios incluyen: compound index {author, title} único, nuevos campos (category, servings, source, sourceUrl, aiNotes, views, likes, likedBy, comments, nutrition), timestamps, normalización de tags, nuevos índices, campos de User (bio, avatar, socialLinks), y eliminación de Ingredient/Step como modelos independientes.
- Verificar que las imports existentes de `models.ts` funcionan con los nuevos tipos inferidos.

### ✓ Step 2: Actualizar validaciones Zod y exports del paquete com
Alinear los límites de Zod con el esquema v2 y añadir los nuevos schemas de validación.

- Subir límites: title 50→200, description 500→5000, text 800→5000, note 500→2000, ingredientName 50→200.
- Añadir schemas nuevos: categorySchema, servingsSchema, sourceSchema, sourceUrlSchema, aiNotesSchema, commentSchema, nutritionSchema, bioSchema, avatarSchema, socialLinksSchema.
- Exportar los nuevos schemas desde com/index.ts y com/validate.ts.
- Añadir validadores en validate.ts para los nuevos campos.

### ✓ Step 3: Actualizar repositorios y casos de uso de la API
Aceptar los nuevos campos en create, update, delete y get de recetas.

- createRecipe/recipeRepository.ts: aceptar campos opcionales nuevos en el objeto de creación.
- createRecipe/createRecipe.ts: actualizar firmas para aceptar category, servings, source, sourceUrl, aiNotes con validación Zod.
- recipeEdit/recipeEditRepository.ts: aceptar campos nuevos en update; añadir limpieza referencial de favorites y likedBy al borrar.
- recipeEdit/recipeEdit.ts: aceptar campos nuevos en el body de update con validación.
- getRecipeById/recipeRepository.ts: añadir $inc {views: 1} en la consulta (no lean, necesita guardar).
- getRecipeById/getRecipeById.ts: los campos nuevos llegan en la respuesta sin cambios adicionales.

### ✓ Step 4: Actualizar handlers de la API
Extraer los nuevos campos del body de las peticiones y pasarlos a los casos de uso.

- createRecipeHandler.ts: extraer category, servings, source, sourceUrl, aiNotes del body y pasarlos a createRecipe.
- recipeEditHandler.ts: extraer los campos editables nuevos del body y pasarlos a updateRecipe.

### ✓ Step 5: Actualizar tipos y lógica del frontend
Añadir los nuevos campos a los tipos y funciones de lógica del frontend.

- app/src/types/recipe.ts: añadir category, servings, source, sourceUrl, aiNotes, views, likes, likedBy, comments, nutrition a RecipeData. Añadir tipos Comment y Nutrition.
- app/src/logic/createRecipe.ts: aceptar parámetros nuevos (category, servings) y enviarlos en el body.
- app/src/logic/updateRecipe.ts: aceptar campos nuevos en el body.

### ✓ Step 6: Actualizar componentes UI del frontend
Añadir campos nuevos al formulario de edición y a la vista de detalle de receta.

- SaveRecipe/index.tsx: añadir select de category (similar al select de difficulty) e input number de servings (similar al input de time). Actualizar handleRecipeFormSubmit para incluir estos campos.
- Recipe.tsx: mostrar category junto a difficulty/time, servings con icono, badge de source, contador de likes y views, sección de nutrition si existe.
- RecipeThumbnail.tsx y MyRecipeThumbnail.tsx: opcional, mostrar category o badge source.

### ✓ Step 7: Actualizar pruebas de la API
Actualizar las specs existentes para que funcionen con el nuevo esquema y añadir pruebas de los nuevos campos.

- createRecipe.spec.js: actualizar mensajes de error (title 200, description 5000), añadir pruebas con campos nuevos (category, servings, source, etc.).
- updateRecipe.spec.js: añadir pruebas de update con campos nuevos.
- deleteRecipe.spec.js: añadir prueba de limpieza referencial de favorites y likedBy.
- recipeElements.spec.js: verificar que los campos nuevos no rompen las operaciones de elementos.
- validateRecipeFields.spec.js: actualizar límites esperados y añadir validaciones nuevas.
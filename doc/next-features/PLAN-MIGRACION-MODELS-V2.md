# Plan de migración a models.v2 — MongoDB

Este documento cataloga todos los cambios necesarios en la aplicación al migrar del esquema actual (`models.ts`) al nuevo esquema (`models.v2.ts`).

Se centra exclusivamente en los cambios de base de datos, esquemas, índices, repositorios, validaciones y frontend. La integración de IA con Gemini API se documenta por separado en `PLAN-IA-GEMINI.md`.

---

## Cambios en el esquema (models.v2.ts)

### Recipe — campos nuevos
- `category` (enum: entrante, principal, postre, sopa, ensalada, snack, bebida, otro)
- `servings` (número 1–100)
- `source` (enum: manual, ai-generated, url-import, default: manual)
- `sourceUrl` (string, maxlength 2000)
- `aiNotes` (string, maxlength 2000)
- `views` (número, default 0)
- `likes` (número, default 0)
- `likedBy` (array de ObjectId ref User)
- `comments` (subdocumentos embebidos: user, text, createdAt, parentId)
- `nutrition` (objeto: calories, protein, carbs, fat)

### Recipe — cambios en campos existentes
- `title`: maxlength 200 (antes sin límite en schema, 50 en Zod)
- `description`: maxlength 5000 (antes sin límite en schema, 500 en Zod)
- `tags`: normalización automática (lowercase + trim)
- `ingredient.name`: maxlength 200 (antes sin límite)
- `step.text`: maxlength 5000 (antes sin límite)
- `step.note`: maxlength 2000 (antes sin límite)

### Recipe — cambios de índice
- Eliminado: `unique: true` en `title` solo
- Añadido: `{ author: 1, title: 1 }` con `unique: true`
- Añadido: `{ author: 1, date: -1 }`
- Añadido: `{ author: 1, published: 1, date: -1 }`
- Añadido: `{ title: 'text', description: 'text', tags: 'text' }` (búsqueda full-text)
- Añadido: `{ 'ingredients.name': 1 }`
- Añadido: `{ difficulty: 1 }`, `{ time: 1 }`, `{ category: 1 }`
- Añadido: `{ source: 1, createdAt: -1 }`
- Añadido: `{ likes: -1, published: 1 }`, `{ views: -1, published: 1 }`
- Añadido: `timestamps: true` (createdAt, updatedAt automáticos)

### User — campos nuevos
- `bio` (string, maxlength 500)
- `avatar` (string, maxlength 500)
- `socialLinks` (objeto: twitter, instagram, website)
- `timestamps: true` (createdAt, updatedAt)

### Modelos eliminados
- `Ingredient` y `Step` como colecciones independientes (ahora solo subdocumentos embebidos)

---

## Qué hay que cambiar en cada área

### 1. API — Capa de datos (models)

| Archivo | Acción |
|---------|--------|
| `api/data/models.ts` | Reemplazar contenido por `models.v2.ts` (o renombrar v2 a models.ts) |
| `api/data/populate.js` | Actualizar: ya no usar `new Ingredient()` ni `new Step()` como modelos independientes; usar objetos planos |

### 2. API — Repositorios de recetas

| Archivo | Cambio |
|---------|--------|
| `api/modules/recipes/createRecipe/recipeRepository.ts` | Aceptar nuevos campos opcionales: `category`, `servings`, `source`, `sourceUrl`, `aiNotes` |
| `api/modules/recipes/recipeEdit/recipeEditRepository.ts` | Aceptar nuevos campos en update; añadir limpieza referencial de `favorites` y `likedBy` al borrar receta |
| `api/modules/recipes/getRecipeById/recipeRepository.ts` | Los tipos se actualizan automáticamente con `InferSchemaType`; verificar que los campos nuevos se serializan |
| `api/modules/recipes/recipeList/recipeListRepository.ts` | Los tipos se actualizan; los listados pueden incluir los nuevos campos |

### 3. API — Casos de uso de recetas

| Archivo | Cambio |
|---------|--------|
| `api/modules/recipes/createRecipe/createRecipe.ts` | Aceptar parámetros nuevos: `category`, `servings`, `source`, `sourceUrl`, `aiNotes` |
| `api/modules/recipes/recipeEdit/recipeEdit.ts` | Aceptar campos nuevos en update body |
| `api/modules/recipes/getRecipeById/getRecipeById.ts` | Incrementar `views` con `$inc: { views: 1 }` al consultar |

### 4. API — Handlers de recetas

| Archivo | Cambio |
|---------|--------|
| `api/modules/recipes/createRecipe/createRecipeHandler.ts` | Extraer campos nuevos del body de la petición |
| `api/modules/recipes/recipeEdit/recipeEditHandler.ts` | Extraer campos nuevos del body de la petición |

### 5. API — Nuevos endpoints (futuros)

Los siguientes endpoints no existen aún pero se necesitarán para las nuevas features:

| Endpoint | Propósito |
|----------|-----------|
| `POST /recipes/:recipeId/like` | Dar/quitar like a una receta |
| `POST /recipes/:recipeId/comments` | Añadir comentario |
| `DELETE /recipes/:recipeId/comments/:commentId` | Eliminar comentario |
| `PATCH /users/profile` | Actualizar bio, avatar, socialLinks |
| `GET /recipes/search` | Búsqueda con filtros combinables (author, ingredients, difficulty, time, category, tags, text search, sort, pagination) |

### 6. Paquete compartido — Validaciones Zod

| Archivo | Cambio |
|---------|--------|
| `com/schemas.ts` | Añadir schemas nuevos: `categorySchema`, `servingsSchema`, `sourceSchema`, `sourceUrlSchema`, `aiNotesSchema`, `commentSchema`, `nutritionSchema`, `bioSchema`, `avatarSchema`, `socialLinksSchema`. Actualizar límites: `titleSchema` a maxlength 200, `descriptionSchema` a maxlength 5000, `textSchema` a maxlength 5000, `noteSchema` a maxlength 2000 |
| `com/validate.ts` | Exportar las nuevas validaciones |
| `com/index.ts` | Exportar los nuevos schemas |

### 7. Frontend — Tipos

| Archivo | Cambio |
|---------|--------|
| `app/src/types/recipe.ts` | Añadir campos nuevos a `RecipeData`: `category`, `servings`, `source`, `sourceUrl`, `aiNotes`, `views`, `likes`, `likedBy`, `comments`, `nutrition`. Actualizar `RecipeListItem` con campos útiles para listados |

### 8. Frontend — Lógica de recetas

| Archivo | Cambio |
|---------|--------|
| `app/src/logic/createRecipe.ts` | Aceptar parámetros nuevos: `category`, `servings` |
| `app/src/logic/updateRecipe.ts` | Aceptar campos nuevos en el body |
| `app/src/logic/getRecipeById.ts` | Sin cambios (los campos nuevos llegan en la respuesta) |

### 9. Frontend — Componentes UI

| Archivo | Cambio |
|---------|--------|
| `app/src/view/Home/common/Recipe.tsx` | Mostrar nuevos campos: `category`, `servings`, `source` (badge), `likes`, `views`, `nutrition`, `comments` |
| `app/src/view/Home/SaveRecipe/index.tsx` | Añadir campos al formulario: `category` (select), `servings` (number). Los campos de IA se dejan para la capa premium |
| `app/src/view/Home/common/RecipeThumbnail.tsx` | Opcional: mostrar `category` o `servings` en miniaturas |
| `app/src/view/Home/common/MyRecipeThumbnail.tsx` | Opcional: mostrar `category` o `source` badge |

### 10. Frontend — Perfil de usuario (futuro)

| Archivo | Cambio |
|---------|--------|
| Nuevo componente de perfil | Mostrar/editar `bio`, `avatar`, `socialLinks` |

### 11. Pruebas

| Archivo | Cambio |
|---------|--------|
| Specs de creación de receta | Añadir pruebas con campos nuevos |
| Specs de edición de receta | Añadir pruebas con campos nuevos |
| Specs de eliminación de receta | Verificar limpieza de `favorites` y `likedBy` |
| Specs de listados | Verificar que los campos nuevos no rompen los listados |
| `api/data/populate.js` | Actualizar datos de prueba con campos nuevos |

---

## Orden recomendado de implementación

1. **Migrar models.ts a models.v2** — cambiar el esquema base
2. **Actualizar validaciones Zod** — alinear límites y añadir nuevos schemas
3. **Actualizar repositorios y casos de uso** — aceptar los nuevos campos
4. **Actualizar handlers** — extraer campos del body
5. **Actualizar tipos frontend** — RecipeData, RecipeListItem
6. **Actualizar lógica frontend** — createRecipe, updateRecipe
7. **Actualizar componentes UI** — Recipe, SaveRecipe
8. **Actualizar populate.js** — datos de prueba
9. **Actualizar pruebas** — specs de API
10. **Nuevos endpoints** — likes, comentarios, búsqueda, perfil (en sprints futuros)

---

## Notas importantes

- **Limpieza referencial:** Al borrar una receta, se debe limpiar `favorites` y `likedBy` de todos los usuarios. Esto se hace en `recipeEditRepository.ts`.
- **Tags normalizados:** MongoDB convierte automáticamente a minúsculas y trim. Las validaciones Zod ya normalizan en el frontend, pero el esquema ahora también lo hace.
- **Índice único de título:** Ahora es `{ author: 1, title: 1 }` en lugar de solo `title`. Dos usuarios pueden tener recetas con el mismo título.
- **Timestamps:** `createdAt` y `updatedAt` se gestionan automáticamente por Mongoose. El campo `date` existente de Recipe se mantiene como "fecha de la receta" (cuándo se cocinó).
- **Campos de IA:** `source`, `sourceUrl`, `aiNotes` se preparan para la capa premium pero no se usan en el formulario inicial.
- **Comentarios:** Embebidos en Recipe (opción A), recomendados mientras haya < 100 comentarios por receta.
- **Base de producción vacía:** Como se parte de una base vacía, no hay migración de datos necesaria. Los índices nuevos se crean automáticamente.
- **Límites Zod vs Schema:** Los límites en Zod (`com/schemas.ts`) deben alinearse con los maxlength del esquema. Actualmente Zod es más restrictivo (title 50 vs schema 200, description 500 vs schema 5000). Hay que decidir si subir los límites de Zod o mantenerlos bajos.

---

## Detalle por área

### Área 1: API — Modelos

**Archivo: `api/data/models.ts`**
- Reemplazar por el contenido de `models.v2.ts`
- Los tipos `RecipeDocument` y `UserDocument` se infieren automáticamente con `InferSchemaType`
- Los índices se crean al conectar Mongoose

**Archivo: `api/data/populate.js`**
- Eliminar uso de `new Ingredient()` y `new Step()` como modelos
- Usar objetos planos para ingredientes y pasos
- Opcional: añadir datos de ejemplo para campos nuevos (category, servings)

---

### Área 2: API — Repositorios

**`recipeEditRepository.ts` — deleteRecipeDoc:**
```typescript
export const deleteRecipeDoc = async (recipeId: string) => {
    await Recipe.findByIdAndDelete(recipeId).exec()
    await User.updateMany({ favorites: recipeId }, { $pull: { favorites: recipeId } }).exec()
    await Recipe.updateMany({ likedBy: recipeId }, { $pull: { likedBy: recipeId } }).exec()
}
```

**`getRecipeById/recipeRepository.ts`:**
- Añadir `$inc: { views: 1 }` en la consulta
- Los campos nuevos se incluyen automáticamente en la respuesta

**`createRecipe/recipeRepository.ts`:**
- Aceptar los campos opcionales nuevos en el objeto de creación

**`recipeEdit/recipeEditRepository.ts`:**
- Aceptar los campos nuevos en el objeto de actualización

---

### Área 3: API — Casos de uso

**`createRecipe.ts`:**
- Firmas actualizadas para aceptar `category`, `servings`, `source`, `sourceUrl`, `aiNotes`
- Validación con Zod (cuando se actualicen los schemas)

**`recipeEdit.ts`:**
- Aceptar campos nuevos en el body
- Validación con Zod

**`getRecipeById.ts`:**
- Incrementar views
- Los campos nuevos llegan en la respuesta sin cambios

---

### Área 4: API — Handlers

**`createRecipeHandler.ts`:**
- Extraer del body: `category`, `servings`, `source`, `sourceUrl`, `aiNotes`
- Pasar al caso de uso

**`recipeEditHandler.ts`:**
- Extraer del body los campos editables nuevos
- Pasar al caso de uso

---

### Área 5: Validaciones Zod (com)

**Nuevos schemas en `com/schemas.ts`:**
```typescript
export const categorySchema = z.string()
    .refine(c => ['entrante', 'principal', 'postre', 'sopa', 'ensalada', 'snack', 'bebida', 'otro'].includes(c),
        'invalid category')

export const servingsSchema = z.number()
    .refine(n => Number.isInteger(n) && n >= 1 && n <= 100,
        'invalid servings, must be between 1 and 100')

export const sourceSchema = z.string()
    .refine(s => ['manual', 'ai-generated', 'url-import'].includes(s),
        'invalid source')

export const sourceUrlSchema = z.string().url().max(2000)
export const aiNotesSchema = z.string().max(2000)
export const commentSchema = z.string().min(1).max(1000)
export const bioSchema = z.string().max(500)
export const avatarSchema = z.string().url().max(500)
```

**Schemas actualizados:**
- `titleSchema`: maxlength de 50 a 200
- `descriptionSchema`: maxlength de 500 a 5000
- `textSchema`: maxlength de 800 a 5000
- `noteSchema`: maxlength de 500 a 2000

---

### Área 6: Frontend — Tipos

**`app/src/types/recipe.ts`:**
```typescript
export type RecipeData = {
    // ... campos existentes
    category?: string
    servings?: number
    source?: string
    sourceUrl?: string
    aiNotes?: string
    views?: number
    likes?: number
    likedBy?: string[]
    comments?: Comment[]
    nutrition?: Nutrition
}

export type Comment = {
    user: { username: string }
    text: string
    createdAt: string
    parentId?: string
}

export type Nutrition = {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
}
```

---

### Área 7: Frontend — Componentes

**`SaveRecipe/index.tsx` — Formulario de edición:**
- Añadir select para `category` (similar al select de difficulty)
- Añadir input number para `servings` (similar al input de time)
- Los campos de IA se dejan para la capa premium

**`Recipe.tsx` — Vista de detalle:**
- Mostrar `category` junto a difficulty/time
- Mostrar `servings` con icono
- Mostrar badge de `source` (IA/manual)
- Mostrar contador de `likes` y `views`
- Sección de `nutrition` (si existe)
- Sección de `comments` (futuro)

---

### Decisión pendiente: límites de Zod

Los límites actuales de Zod son más restrictivos que los del esquema:

| Campo | Zod actual | Schema v2 | Decisión |
|-------|-----------|-----------|----------|
| title | 50 | 200 | Subir Zod a 200 |
| description | 500 | 5000 | Subir Zod a 5000 |
| step.text | 800 | 5000 | Subir Zod a 5000 |
| step.note | 500 | 2000 | Subir Zod a 2000 |
| ingredient.name | 50 | 200 | Subir Zod a 200 |

Subir los límites de Zod permite que el frontend acepte los mismos valores que el esquema. Los componentes UI pueden mantener límites más bajos en los inputs (maxLength en HTML) como guía visual.

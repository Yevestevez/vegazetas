---
sessionId: session-261115-131650-7rgw
---

# Análisis y Cambios Propuestos

### Situación actual

Las interfaces de datos de receta están duplicadas en **12 archivos** con variantes que difieren en campos:

**`Recipe` para listas** (6 definiciones):
- `logic/getMyRecipes.ts`, `logic/getPublishedRecipes.ts`, `logic/getFavoritesRecipes.ts`
- `view/Home/MyRecipes/index.tsx`, `view/Home/Discover/index.tsx`, `view/Home/Favorites/index.tsx`

**`Recipe` mínimo** (1 definición):
- `logic/getRecipeById.ts`: solo `{ id, [key: string]: any }`

**`Recipe` en thumbnails** (2 definiciones):
- `RecipeThumbnail.tsx`: `RecipeThumbnailRecipe` con `author`
- `MyRecipeThumbnail.tsx`: `MyRecipeThumbnailRecipe` sin `author`

**`RecipeData` completo** (2 definiciones):
- `SaveRecipe/index.tsx`: con `Ingredient[]` y `Step[]`
- `Recipe.tsx`: con ingredients y steps inline

**`Ingredient` y `Step`** (1 definición cada una, en `SaveRecipe/index.tsx`)

### Propuesta

Crear `app/src/types/recipe.ts` con:
1. `Ingredient` — tipo base compartido
2. `Step` — tipo base compartido
3. `RecipeListItem` — receta para listas (campos comunes: id, title, published, isFavorite, images, date)
4. `RecipeListItemWithAuthor` — extiende RecipeListItem con `author` y `own?` (para Discover/Favorites)
5. `RecipeData` — receta completa con ingredients y steps (para SaveRecipe y Recipe)

Luego actualizar los 12 archivos para importar de `types/recipe.ts` en lugar de definir localmente.

### Enfoque

- Usar `type` en lugar de `interface` para las uniones/extensiones (`RecipeListItemWithAuthor = RecipeListItem & { author: { username: string }, own?: boolean }`)
- Mantener `[key: string]: any` en los tipos de lista para compatibilidad con datos de API dinámicos
- Los props de componente (`SaveRecipeProps`, `DiscoverProps`, etc.) se mantienen en cada componente
- No se importa de `com` aún (los modelos Mongoose aún son JS); el path queda preparado para cuando `com` exporte los tipos

# Delivery Steps

### ✓ Step 1: Crear app/src/types/recipe.ts con tipos canónicos
Crear el archivo central con las definiciones canónicas:
- `Ingredient`: `{ id, name, quantity, unit, annotation?, main }`
- `Step`: `{ id, text, note?, image?, order? }`
- `RecipeListItem`: `{ id, title, published, isFavorite, images, date, [key: string]: any }`
- `RecipeListItemWithAuthor`: extiende RecipeListItem con `author: { username: string }` y `own?: boolean`
- `RecipeData`: receta completa con `ingredients: Ingredient[]`, `steps: Step[]` y campos adicionales
- Exportar todos los tipos como named exports

### ✓ Step 2: Actualizar logic/ y componentes para importar de types/recipe.ts
Sustituir las definiciones inline por imports en los 12 archivos:
- `logic/getMyRecipes.ts`: importar `RecipeListItem`, eliminar interface local
- `logic/getPublishedRecipes.ts`: importar `RecipeListItemWithAuthor`, eliminar interface local
- `logic/getFavoritesRecipes.ts`: importar `RecipeListItemWithAuthor`, eliminar interface local
- `logic/getRecipeById.ts`: importar `RecipeData` (o mantener mínimo si prefiere no tipar completo)
- `view/Home/MyRecipes/index.tsx`: importar `RecipeListItem`
- `view/Home/Discover/index.tsx`: importar `RecipeListItemWithAuthor`
- `view/Home/Favorites/index.tsx`: importar `RecipeListItemWithAuthor`
- `view/Home/SaveRecipe/index.tsx`: importar `Ingredient`, `Step`, `RecipeData`
- `view/Home/common/Recipe.tsx`: importar `Ingredient`, `Step`, `RecipeData`
- `view/Home/common/RecipeThumbnail.tsx`: importar `RecipeListItemWithAuthor` como `RecipeThumbnailRecipe`
- `view/Home/common/MyRecipeThumbnail.tsx`: importar `RecipeListItem` como `MyRecipeThumbnailRecipe`
- Verificar con `tsc --noEmit` y `vite build` que todo compila
- Ejecutar los 32 tests Playwright para confirmar que no hay regresiones
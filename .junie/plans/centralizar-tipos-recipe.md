---
sessionId: session-261115-131650-7rgw
---

# Baterías de tests Playwright — cobertura de interacción de usuario

### Contexto

Los tests existentes (32) cubren autenticación, listas de recetas con favoritos, y el campo de tiempo opcional. Pero **no hay tests que verifiquen la navegación entre páginas ni las acciones de usuario** sobre recetas: crear, editar, gestionar ingredientes/pasos, ver, eliminar, publicar, ni navegar desde Landing.

### Scope

**In Scope:**
1. Navegación del menú: Menu → Mis recetas/Descubre/Favoritas; logo → Menu; botón atrás en receta.
2. Creación de receta completa: desde Menu → crear → navegar a la receta.
3. Edición de receta: título, descripción, dificultad, tags desde SaveRecipe.
4. Gestión de ingredientes: añadir/eliminar en SaveRecipe.
5. Gestión de pasos: añadir/eliminar/reordenar en SaveRecipe.
6. Visualización y acciones de receta: ver, toggle favorito, eliminar con confirm, editar → SaveRecipe.
7. Eliminación desde MyRecipes: eliminar receta desde el thumbnail.
8. Publicar/despublicar: toggle publish desde SaveRecipe.
9. Recuperación de contraseña: solicitar recovery desde Login con confirm.
10. Landing page: navegación Landing → Login y Landing → Registro.

**Out of Scope:**
- Tests de rendimiento o accesibilidad.
- Tests de imágenes de receta (añadir/eliminar imágenes).
- Estos se cubrirán en baterías posteriores si se acuerda.

### User Stories

As a user, I want to:
- Navegar desde el menú a Mis recetas, Descubre y Favoritas.
- Volver al menú haciendo click en el logo.
- Navegar desde Landing a Login y Registro.
- Crear una receta nueva desde el menú y llegar a la página de edición.
- Editar campos básicos de una receta (título, descripción, dificultad, tags).
- Añadir y eliminar ingredientes en una receta.
- Añadir, eliminar y reordenar pasos en una receta.
- Ver una receta, toggle favorito, eliminarla con confirmación, y editarla.
- Eliminar una receta desde MyRecipes.
- Publicar/despublicar una receta desde SaveRecipe.
- Solicitar recuperación de contraseña desde Login.
- Usar el botón atrás en la vista de receta.

### Functional Requirements

1. **Menu → Mis recetas**: Click en "Mis recetas" navega a `/my-recipes`.
2. **Menu → Descubre**: Click en "Descubre" navega a `/discover`.
3. **Menu → Favoritas**: Click en "Favoritas" navega a `/favorites`.
4. **Logo → Menú**: Click en el logo desde cualquier página interna navega a `/menu`.
5. **Landing → Login**: Click en "Inicio" navega a `/login`.
6. **Landing → Registro**: Click en "Registro" navega a `/register`.
7. **Botón atrás en receta**: Click en el botón atrás navega a `/home` si no hay historial.
8. **Crear receta desde menú**: Click en "Nueva receta" navega a `/create-recipe/:id`.
9. **Editar título**: Cambiar título y guardar actualiza la receta.
10. **Editar descripción**: Cambiar descripción y guardar actualiza.
11. **Editar dificultad**: Seleccionar dificultad y guardar actualiza.
12. **Añadir tag**: Añadir etiqueta y guardar actualiza.
13. **Añadir ingrediente**: Llenar formulario de ingrediente y añadir.
14. **Eliminar ingrediente**: Click en eliminar ingrediente con confirm.
15. **Añadir paso**: Llenar formulario de paso y añadir.
16. **Eliminar paso**: Click en eliminar paso con confirm.
17. **Reordenar paso**: Mover paso arriba/abajo.
18. **Ver receta**: Navegar a `/recipe/:id` y ver título, ingredientes, pasos.
19. **Toggle favorito en receta**: Click en estrella y verificar estado.
20. **Eliminar receta desde Recipe**: Click en eliminar con confirm, navegar a MyRecipes.
21. **Editar receta desde Recipe**: Click en editar, navegar a SaveRecipe.
22. **Eliminar desde MyRecipes**: Click en eliminar desde thumbnail con confirm.
23. **Publicar receta**: Click en publicar desde SaveRecipe con confirm.
24. **Despublicar receta**: Click en despublicar desde SaveRecipe con confirm.
25. **Recuperar contraseña**: Click en "¿Olvidaste tu contraseña?" con confirm.
26. **Botones de menú deshabilitados**: Click muestra alert sin navegar.

### Arquitectura de tests

Cada batería seguirá el patrón existente:
- `beforeEach`: inyectar token con `page.addInitScript`, configurar mocks de API con `page.route`.
- `afterEach`: limpiar usuarios creados con `removeE2eUser`.
- Usar `page.getByRole`, `page.getByLabel`, `page.getByText` para localizar elementos.
- Verificar URLs con `expect(page).toHaveURL()`.
- Mockear las rutas API necesarias para cada test (users/name, recipes/*, etc.).
- Los tests que crean usuarios usarán `request.post()` como en `authentication.spec.js`.

### File Structure

```
app/e2e/
  navigation.spec.js      ← 10 tests de navegación (menú, logo, landing, atrás)
  createRecipe.spec.js    ← 3 tests de creación de receta
  editRecipe.spec.js      ← 6 tests de edición (título, descripción, dificultad, tags)
  ingredients.spec.js     ← 3 tests de gestión de ingredientes
  steps.spec.js           ← 4 tests de gestión de pasos
  recipeActions.spec.js   ← 6 tests de acciones (ver, favorito, eliminar, editar)
  myRecipesActions.spec.js ← 2 tests (eliminar desde MyRecipes, publicar/despublicar)
  passwordRecovery.spec.js ← 2 tests de recuperación de contraseña
```

### Riesgos

- **Dependencia de MongoDB**: Los tests de creación/edición necesitan la API real. Se usarán mocks de API donde sea posible para aislar el frontend.
- **Estado compartido**: Cada test creará su propia receta o usará mocks para evitar interferencias.
- **Componentes de 1000+ líneas**: `SaveRecipe/index.tsx` tiene mucha lógica; los tests se centrarán en los flujos principales sin cubrir cada validación de formulario.

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

### ✓ Step 3: Crear navigation.spec.js con tests de navegación
Crear `app/e2e/navigation.spec.js` con 10 tests:
- **Menu → Mis recetas**: Login, ir a `/menu`, click en "Mis recetas", verificar URL `/my-recipes`.
- **Menu → Descubre**: Click en "Descubre", verificar URL `/discover`.
- **Menu → Favoritas**: Click en "Favoritas", verificar URL `/favorites`.
- **Logo → Menú desde MyRecipes**: Ir a `/my-recipes`, click en el logo, verificar URL `/menu`.
- **Logo → Menú desde Discover**: Ir a `/discover`, click en el logo, verificar URL `/menu`.
- **Logo → Menú desde Favorites**: Ir a `/favorites`, click en el logo, verificar URL `/menu`.
- **Landing → Login**: Ir a `/landing`, click en "Inicio", verificar URL `/login`.
- **Landing → Registro**: Ir a `/landing`, click en "Registro", verificar URL `/register`.
- **Redirección /menu sin sesión**: Ir a `/menu` sin token, verificar redirección a `/landing`.
- **Crear receta desde menú**: Click en "Nueva receta", verificar que navega a `/create-recipe/:id`.
- Mockear `recipes/my-recipes`, `recipes/published-recipes`, `recipes/favorites-recipes` y `users/name`.
- Ejecutar tests para verificar que pasan.

### ✓ Step 4: Crear createRecipe.spec.js y editRecipe.spec.js
Crear dos baterías de tests para creación y edición:

**`createRecipe.spec.js`** (3 tests):
- **Crear receta desde menú**: Click en "Nueva receta" en Menu, verificar navegación a `/create-recipe/:id`, verificar que el título predeterminado se muestra.
- **Guardar receta con título**: Llenar título y guardar, verificar alerta de éxito y que la receta se actualiza.
- **Validación de título vacío**: Intentar guardar sin título, verificar alerta de error.

**`editRecipe.spec.js`** (6 tests):
- **Editar título**: Navegar a `/update-recipe/:id`, cambiar título, guardar, verificar actualización.
- **Editar descripción**: Cambiar descripción, guardar, verificar.
- **Editar dificultad**: Seleccionar dificultad del dropdown, guardar, verificar.
- **Editar tiempo**: Establecer tiempo, guardar, verificar (complementa recipeTime.spec.js).
- **Añadir tag**: Llenar formulario de tag, guardar, verificar que aparece.
- **Eliminar tag**: Click en eliminar tag con confirm, verificar que desaparece.
- Mockear `recipes/:id` (GET y PATCH) y `recipes/:id/tags`.
- Ejecutar tests para verificar que pasan.

### ✓ Step 5: Crear ingredients.spec.js y steps.spec.js
Crear dos baterías para gestión de sub-componentes:

**`ingredients.spec.js`** (3 tests):
- **Añadir ingrediente**: En SaveRecipe, llenar nombre/cantidad/unidad, click en añadir, verificar que aparece en la lista.
- **Eliminar ingrediente**: Click en eliminar ingrediente, confirmar, verificar que desaparece.
- **Validación de ingrediente sin nombre**: Intentar añadir sin nombre, verificar alerta.
- Mockear `recipes/:id/ingredients` (POST y DELETE).

**`steps.spec.js`** (4 tests):
- **Añadir paso**: Llenar texto del paso, click en añadir, verificar que aparece.
- **Eliminar paso**: Click en eliminar, confirmar, verificar que desaparece y se reordenan.
- **Mover paso arriba**: Click en flecha arriba, verificar que cambia de posición.
- **Mover paso abajo**: Click en flecha abajo, verificar que cambia de posición.
- Mockear `recipes/:id/steps` (POST, DELETE) y `recipes/:id/steps/reorder`.
- Ejecutar tests para verificar que pasan.

### ✓ Step 6: Crear recipeActions.spec.js
Crear `app/e2e/recipeActions.spec.js` con 6 tests de acciones en la vista de receta:
- **Ver receta completa**: Navegar a `/recipe/:id`, verificar título, ingredientes, pasos.
- **Toggle favorito**: Click en estrella, verificar alerta y cambio de estado.
- **Eliminar receta**: Click en eliminar, confirmar, verificar navegación a `/my-recipes`.
- **Editar desde Recipe**: Click en editar, verificar navegación a `/update-recipe/:id`.
- **Botón atrás sin historial**: Ir a `/recipe/:id` directamente, click en atrás, verificar navegación a `/home`.
- **Botones deshabilitados**: Click en "Añadir a lista" y "Compartir", verificar alertas.
- Mockear `recipes/:id` (GET), `recipes/:id` (DELETE), y `users/favorites/:id`.
- Ejecutar tests para verificar que pasan.

### ✓ Step 7: Crear myRecipesActions.spec.js y passwordRecovery.spec.js
Crear las últimas dos baterías:

**`myRecipesActions.spec.js`** (2 tests):
- **Eliminar desde MyRecipes**: En `/my-recipes`, click en eliminar desde thumbnail, confirmar, verificar que desaparece.
- **Publicar/despublicar**: Navegar a SaveRecipe, click en publicar/despublicar, confirmar, verificar cambio de estado.
- Mockear `recipes/my-recipes`, `recipes/:id` (DELETE), y `recipes/:id/publish`.

**`passwordRecovery.spec.js`** (2 tests):
- **Solicitar recuperación**: Ir a `/login`, click en "¿Olvidaste tu contraseña?", llenar email, confirmar, verificar alerta de éxito.
- **Cancelar recuperación**: Click en "¿Olvidaste tu contraseña?", llenar email, cancelar confirm, verificar que no se envía.
- Mockear `users/password/recover`.
- Ejecutar todos los tests nuevos (32 existentes + ~33 nuevos = ~65 tests) para verificar que pasan.
---
sessionId: session-261116-161405-15j9
---

# Requisitos

### Overview
Mejorar la organización de los estilos CSS/Tailwind y el responsive del proyecto Vegazetas. El objetivo es reducir la repetición de clases, aprovechar mejor el espacio en pantallas grandes, y pulir detalles de diseño.

### Scope

**Incluido:**
- Utilidades personalizadas en Tailwind para patrones repetidos (sombras duras, transiciones, focus-ring)
- Mejora del responsive: contenedores más anchos, más columnas en grids, breakpoints para pantallas grandes
- Rotación de botones de menú más sutil
- Footer con transparencia y backdrop-blur
- Limpieza: eliminar bloque comentado en main.css, safelist innecesario, content path inexistente
- Separar `transition-all` por `transition-transform` en elementos interactivos
- Eliminar `leading-tight` repetido por breakpoint

**Excluido:**
- Mejoras de accesibilidad por contraste de colores (se dejará para más tarde, requiere elegir colores a mano)
- Extracción de componentes de SaveRecipe (se dejará para un sprint posterior)
- Migración a Tailwind v4 (se evaluará por separado)

### Criterios de Aceptación
- Las className de los componentes interactivos se reducen de 10-15 tokens a 2-3 usando utilidades
- En pantallas ≥1536px (2xl), los grids de recetas muestran 4 columnas
- En pantallas ≥1536px, el menú distribuye los botones en 3 columnas
- Las sombras duras usan nombres semánticos (`shadow-hard-lg`) en vez de valores hardcodeados
- La rotación de botones de menú es sutil (±0.5deg base, ±1deg hover/active)
- El footer tiene `bg-black/80` con `backdrop-blur-sm`
- No hay `transition-all` en elementos interactivos; se usa `transition-transform`

# Diseño Técnico

### Estado Actual

**tailwind.config.js** (33 líneas):
- 10 colores personalizados neón
- 1 breakpoint extra: `xs: 480px`
- Safelist con patrón de colores (innecesario: los colores se usan directamente en componentes)
- `content` incluye `./components/**/*` (el directorio no existe; los componentes están en `src/view/`)

**main.css** (36 líneas):
- Import de Google Fonts (Anybody variable font)
- Bloque `:root` comentado con las 10 variables de color duplicadas (líneas 7-18)
- `@layer components` con `.anybody-logo` y `.anybody-title`

**Patrones repetidos en componentes:**
- `transition-all duration-150 ease-out hover:scale-105 active:scale-95` → ~12 componentes
- `focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105` → ~12 componentes
- `shadow-[0.4rem_0.4rem_0_0_rgba(0,0,0,0.8)]` y variantes → ~40 lugares con valores distintos (0.2-0.6rem)
- `leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight` → redundante (es un valor fijo)
- `max-w-7xl` en todos los contenedores principales → espacio desaprovechado en pantallas grandes
- Grids `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` → no escalan a 4+ columnas

### Decisiones Clave

1. **Utilidades en `@layer components` de main.css**: en vez de extender el theme de Tailwind con muchas variantes, se usan clases compuestas en `@layer components`. Es más legible y permite combinar patrones.

2. **`transition-transform` en vez de `transition-all`**: solo se anima `transform` (scale, translate), que es GPU-accelerated. Los cambios de color no necesitan animación en este diseño neón.

3. **Breakpoint `3xl: 1920px`**: Tailwind incluye `2xl: 1536px`, pero para pantallas 2K/4K se necesita un breakpoint adicional para añadir 4ª columna y contenedores más anchos.

4. **`max-w-9xl: 1920px`**: el contenedor actual `max-w-7xl` (1280px) deja mucho espacio vacío en pantallas grandes.

5. **Rotaciones sutiles**: ±0.5deg base, ±1deg hover/active. El efecto se mantiene pero es menos agresivo.

### Cambios Propuestos

#### tailwind.config.js
- Añadir en `extend`:
  - `boxShadow`: `hard-sm` (0.2rem), `hard-md` (0.3rem), `hard-lg` (0.4rem), `hard-xl` (0.5rem), `hard-2xl` (0.6rem)
  - `maxWidth`: `9xl: '1920px'`
  - `screens`: `3xl: '1920px'`
- Eliminar `safelist`
- Eliminar `./components/**/*` de `content`

#### main.css
- Eliminar bloque `:root` comentado (líneas 7-18)
- Añadir en `@layer components`: `.interactive`, `.interactive-hover`, `.interactive-lift`, `.focus-ring`

#### Componentes a modificar

| Componente | Cambios |
|---|---|
| `CircleButton.tsx` | `transition-all` → `.interactive-lift`, focus inline → `.focus-ring`, sombras → `shadow-hard-*` |
| `MenuButton.tsx` | `transition-all` → `.interactive-hover`, focus → `.focus-ring`, sombras → `shadow-hard-*`, rotaciones ±1deg → ±0.5deg |
| `Header.tsx` | `transition-all` → `.interactive-hover`, focus → `.focus-ring` |
| `Footer.tsx` | `bg-black` → `bg-black/80 backdrop-blur-sm`, `transition-transform` → `.interactive-hover` |
| `Recipe.tsx` | Sombras → `shadow-hard-*`, `max-w-7xl` → `max-w-9xl`, pasos `lg:columns-3` → `lg:columns-3 2xl:columns-4` |
| `MyRecipes.tsx` | `max-w-7xl` → `max-w-9xl`, grid `lg:grid-cols-3` → `lg:grid-cols-3 2xl:grid-cols-4` |
| `Discover.tsx` | Igual que MyRecipes |
| `Favorites.tsx` | Igual que MyRecipes |
| `Menu/index.tsx` | `max-w-7xl` → `max-w-9xl`, grid `md:grid-cols-2` → `md:grid-cols-2 2xl:grid-cols-3` |
| `MyRecipeThumbnail.tsx` | Sombras → `shadow-hard-*` |
| `RecipeThumbnail.tsx` | Sombras → `shadow-hard-*` |
| `SaveRecipe/index.tsx` | Sombras → `shadow-hard-*` |

# Testing

### Enfoque de Validación
Verificar que la aplicación compila sin errores y que los cambios visuales son correctos en diferentes tamaños de pantalla.

### Escenarios Clave
1. **Compilación**: `vite build` sin errores
2. **Utilidades**: Los componentes interactivos usan las nuevas clases `.interactive-*` y `.focus-ring`
3. **Sombras**: No quedan `shadow-[...]` hardcodeados en los componentes modificados
4. **Responsive**:
   - A 320px (móvil): grids de 1 columna, layout funcional
   - A 640px (sm): grids de 2 columnas
   - A 1024px (lg): grids de 3 columnas
   - A 1536px (2xl): grids de 4 columnas en recetas, 3 columnas en menú
   - A 1920px (3xl): contenedores anchos, sin espacio vacío excesivo
5. **Rotación**: MenuButton rota ±0.5deg, no ±1deg
6. **Footer**: tiene transparencia y backdrop-blur
7. **Transiciones**: no hay `transition-all` en elementos interactivos

### Casos Borde
- Navegación entre pantallas sin pérdida de estilos
- Focus keyboard en botones muestra outline blanco
- Hover en MenuButton no rompe el grid

# Delivery Steps

### ✓ Step 1: Utilidades Tailwind: sombras, transiciones y focus-ring
Se añaden utilidades personalizadas en tailwind.config.js y main.css para eliminar la repetición de clases.

En tailwind.config.js:
- Escala de sombras duras: `shadow-hard-sm` (0.2rem), `shadow-hard-md` (0.3rem), `shadow-hard-lg` (0.4rem), `shadow-hard-xl` (0.5rem), `shadow-hard-2xl` (0.6rem)
- Se elimina el safelist innecesario
- Se elimina `./components/**/*` de content

En main.css (@layer components):
- `.interactive` → `transition-transform duration-150 ease-out`
- `.interactive-hover` → `.interactive` + `hover:scale-105 active:scale-95`
- `.interactive-lift` → `.interactive-hover` + `hover:-translate-y-2`
- `.focus-ring` → `focus:outline-4 focus:outline-offset-0 focus:outline-white focus:scale-105`

Se actualizan los componentes:
- `CircleButton.tsx`: reemplaza `transition-all` + hover/active/focus por `.interactive-lift .focus-ring`, sombras por `shadow-hard-*`
- `MenuButton.tsx`: reemplaza `transition-all` + hover/active/focus por `.interactive-hover .focus-ring`, sombras por `shadow-hard-*`
- `Header.tsx`: reemplaza `transition-all` + hover/active/focus por `.interactive-hover .focus-ring`
- `Footer.tsx`: reemplaza `transition-transform` + hover/active/focus por `.interactive-hover`
- `Recipe.tsx`, `MyRecipeThumbnail.tsx`, `RecipeThumbnail.tsx`, `SaveRecipe/index.tsx`: sombras hardcodeadas → `shadow-hard-*`

### ✓ Step 2: Responsive: contenedores anchos, grids y breakpoints
Se mejora el uso del espacio en pantallas grandes y se corrigen los cortes responsive.

En tailwind.config.js:
- Se añade breakpoint `3xl: 1920px`
- Se añade `maxWidth: { '9xl': '1920px' }`

En componentes de lista (MyRecipes, Discover, Favorites):
- Contenedor cambia de `max-w-7xl` a `max-w-9xl`
- Grid pasa de `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` a `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`
- Padding lateral se extiende: `px-8 xs:px-10 md:px-12 xl:px-14 2xl:px-16`

En Menu:
- Nav grid pasa de `grid-cols-1 md:grid-cols-2` a `grid-cols-1 md:grid-cols-2 2xl:grid-cols-3`
- Contenedor cambia a `max-w-9xl`

En Recipe:
- Contenedor cambia a `max-w-9xl`
- Sección de pasos: `columns-1 sm:columns-2 lg:columns-3` → `columns-1 sm:columns-2 lg:columns-3 2xl:columns-4`
- Imagen principal: altura se extiende a `2xl:h-96`

Se eliminan los `leading-tight` repetidos por breakpoint en todos los componentes afectados.

### ✓ Step 3: Ajustes de diseño: rotación botones, footer y limpieza
Se pulen los detalles de diseño y se limpia el código.

En MenuButton.tsx:
- Rotación pasa de `rotate-1` / `-rotate-1` a `rotate-[0.5deg]` / `-rotate-[0.5deg]`
- Hover pasa de `hover:-rotate-2` / `hover:rotate-2` a `hover:-rotate-[1deg]` / `hover:rotate-[1deg]`
- Active pasa de `active:rotate-2` / `active:-rotate-2` a `active:rotate-[1deg]` / `active:-rotate-[1deg]`

En Footer.tsx:
- `bg-black` → `bg-black/80 backdrop-blur-sm`

En main.css:
- Se elimina el bloque `:root` comentado (líneas 7-18)

Se verifica que la aplicación compila y se revisa visualmente.
# Vegazetas

## Intro

**Vegazetas** es una aplicación web que permite **crear, ordenar, compartir y descubrir recetas** veganas. Cuenta con un buscador de recetas filtrando por etiquetas e ingredientes.

En futuras versiones contará con una **lista de la compra** automática que añade los ingredientes desde cada receta con solo pulsar un botón, además de un **planificador de menús** mediante un calendario.

![The Office Gif](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjd0ZGh0czA0MHJ3aTFlaDhmcjBtMmtsMjM4eWh6dHNsdTBwN296ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hKyroc5P7axuU/giphy.webp)


## Functional

### Use Cases

User

- Registrarse como usuario nuevo
- Iniciar sesión
- Editar perfil (nombre, contraseña, foto...)
- Eliminar usuario

- Descubrir nuevas recetas de otros usuarios (sección ***Descubre***)
- Buscar recetas filtrando por ingredientes o etiquetas
- Crear una nueva receta (➕)
- Guardar una nueva receta en ***borrador***
- Editar una receta previamente creada
- Eliminar una receta previamente creada
- Visualizar recetas propias (sección ***Mis recetas***)
- Generar listas personalizadas de recetas (sección ***Listas***)
- Generar listas de recetas favoritas desde las recetas (🩷)
- Generar listas de enlaces para guardar recetas externas a la apliación (sección ***Enlaces***)

---

- Generar una lista de la compra desde cada receta mediante un botón
- Editar la manualmente la lista de la compra (añadir, eliminar y ordenar ingredientes)
- Planificar los menús mediante un calendario

### UXUI Design

[Figma](https://www.figma.com/proto/wJ7OQyaNcJneXTPpf4jx6X/Vegazetas?node-id=15-54&p=f&t=RmO05IfsXMPjmZim-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=15%3A54)


## Technical

### Blocks

- App
- API
- DB

### Packages

- app
- api
- com
- doc (documentation)

### Techs

- HTML/CSS/JS
- React
- Node/Express
- ...

### Data Model

**User**
- id *(ObjectId)*
- name *(string)*
- email *(string)*
- username *(string)*
- password *(string) - bcrypt*

**Ingredient**
- id *(ObjectId)*
- name *(string)*
- quantity *(num)*
- unit *(string)*
- annotation *(string)*
- main *(boolean (default: true))*

**Step**
- id *(ObjectId)*
- text *(string)*
- note *(string)*
- image *(string)* 

**Recipe**
- id *(ObjectId)*
- author *(ObjectId - User)*
- images *(strings array)*
- title *(string)*
- date *(Date (default: Date.now))*
- description *(string)*
- time *(number)*
- difficulty *(string)*
- tags *(strings array)*
- ingredients *(ingredients array)*
- steps *(steps array)*

### UI Components

```sh
App
 |- Landing
 |- Register
 |- Login
 |- Home
    # |- Profile (edit, delete...)
    |- Menu
    |- MyRecipes
        |- [RecipeThumbnail]
    |- Recipe
        |- DeleteRecipe
        |- UpdateRecipe
            |- AddIngredientToRecipe
            |- RemoveIngredientToRecipe
            |- AddStepToRecipe
            |- RemoveStepToRecipe
    # |- Favorites
    # |- Lists
    # |- Menus
    # |- Shopping list
    # |- Discover
    # |- Links
    |- CreateRecipe
 ```

### Coverage

![Code Coverage](https://wac-cdn.atlassian.com/dam/jcr:f29e7890-4a7a-4590-bc8b-c4c775ec301d/CDmicro-600x338-retina2x-A_11-58-7.png?cdnVersion=2491)


## Tasks

[GitHub](https://github.com/b00tc4mp/isdi-parttime-202410/issues/45)
<img src="./images/vegazeta-logo.png" alt="Vegazetas logo" height="100">

<br>

# Vegazetas

## Introducción

**Vegazetas** es una aplicación web (SPA) que permite **crear, visualizar, editar y eliminar recetas**. Tiene una interfaz muy colorida, llamativa y simple; y una experiencia de usuario cómoda y sencilla, tanto para crear las recetas como para visualizarlas mientas las preparas en la cocina.

Para ello cuenta con varias secciones y funcionalidades. A nivel de acceso tiene una sección de **registro**, **inicio de sesión** y **recuperación de contraseña** vía envío al mail de un enlace. Una vez iniciada la sesión encontramos un **menú** de navegación entre las distintas secciones y el botón para **crear receta**.

Por ahora, dispone de la sección **Mis recetas**, una lista de vistas en miniaturas de las recetas del usuario y navegación directa a la **visualización de una receta** al seleccionarla. Dentro de la receta podemos eliminarla o navegar hacia la sección de edición de receta.

En esta sección de **edición** podemos modificar los campos de la receta, además de elmiminar y añadir nuevas imágenes, etiquetas, ingredientes y pasos. Los pasos se pueden editar y reordenar. Describiremos todos los campos de la receta de manera más detallada en [Data Model](#data-model).

En **futuras versiones** se implementarán nuevas funcionalidades como:
- Filtro de recetas por ingredientes, etiquetas y títulos
- Visualización de recetas de otros usuarios y botón me gusta para guardar estas recetas en una nueva sección de Mis favoritas
- Compartir recetas mediante enlace
- Sección de listas de recetas
- Enlaces a recetas externas a Vegazetas
- Creación de recetas en modo "borrador/privado" para luego publicarlas en el momento deseado
- Modificación del perfil de usuario y eliminación de cuenta
- Generación automática de una lista de la compra editable en función de los ingredientes de la receta
- Calendario de planificación de menús
- Modo cocina: botón para evitar que se apague la pantalla del móvil o tablet mientas cocinas
- Modificación de raciones de una receta a gusto del usuario (x2, x3...)
- Cambio del tamaño de letra en las recetas
- App completamente responsive (ya es responsive a nivel básico)
- ¡Y mucho más!

<br>

## Funcional

### Casos de uso

User

- Registro
- Inicio de sesión
- Recuperación de contraseña vía mail
- Cierre de sesión
- Creación de recetas
- Edición de recetas
  - Edición y ordenación de pasos
- Eliminación de recetas
- Visualización de receta seleccionada
- Visualización de "mis recetas"


### Diseño UXUI 

[Figma](https://www.figma.com/proto/wJ7OQyaNcJneXTPpf4jx6X/Vegazetas?node-id=149-214&t=m7ZNRd48c95egXOo-1&scaling=scale-down&content-scaling=fixed&page-id=149%3A212&starting-point-node-id=149%3A214)


## Técnico

### Bloques

- App
- API
- DB

### Paquetes

- app
- api
- com
- doc (documentation)

### Tecnologías

- HTML/CSS/JS
- React
- Node/Express

### Modelo de datos

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
- order *(number)*

**Recipe**
- id *(ObjectId)*
- author *(ObjectId - **User**)*
- [images] *(strings array)*
- title *(string)*
- date *(Date (default: Date.now))*
- description *(string)*
- time *(number)*
- difficulty *(string)*
- [tags] *(strings array)*
- [ingredients] *(**ingredients** array)*
- [steps] *(**steps** array)*

### Componentes UI

```sh
App
 |- Landing
 |- Register
 |- Login
 |- PasswordReset
 |- Home
    |- Menu
        |- Header (Menu)
    |- MyRecipes
        |- Header (common)
        |- [RecipeThumbnail]
    |- Recipe:id
        |- Header (common)
    |- SaveRecipe:id (create/update recipe)
        |- Header (common)
    # |- Favorites
    # |- Lists
    # |- Menus
    # |- Shopping list
    # |- Discover
    # |- Links
    # |- Profile (edit, delete...)
 ```

### Cobertura

![Code Coverage](./images/vegazetas-test-coverage-082025.jpg)
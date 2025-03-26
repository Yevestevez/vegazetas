# Camino a ***Vegazetas***

Un listado muy resumido de los pasos para crear la aplicación ***Vegazetas***

- Previo

    - Bocetos del diseño de aplicación en [Figma](https://www.figma.com/proto/wJ7OQyaNcJneXTPpf4jx6X/Vegazetas?node-id=15-54&p=f&t=RmO05IfsXMPjmZim-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=15%3A54) y poner las bases de UI/UX antes de empezar a programar
    - Fichero [README](./README.md) con detalles del proyecto para ayudar a darle su forma inicial

---

- Crear el directorio ***proyect***, y dentro los directorios:
    - api
    - app
    - doc (README.doc)

- Configurar ***api*** como paquete de *node.js*: ```npm init -y```

- Añadir ```{ "Type": "module", }``` en *package.json* para permitir *ES Modules (import/export)*

- Instalar ***CORS*** en *api*. Lo usaré en el futuro para conectar con *app*: ```npm i cors```

- Crear el archivo ***index.js*** en *api*

- Instalar ***Express*** en *api* para crear el servidor: ```npm i express```

- Crear un servidor básico en *index.js* // [Apuntes Express](https://github.com/Yevestevez/apuntes-desarrollo-web-full-stack/blob/main/JavaScript/Servidor-Nodejs-Express/01-servidor-nodejs-express.md)

- Arrancar *api* ```node index.js``` y comprobar que funciona en la consola y en el navegador *(http://localhost:8080)*

- Instalar ***Mongoose*** en *api*. Lo usaré para interactuar con la *db*: ```npm i mongoose```

- Crear el directorio ***data*** en *api*

- Crear el fichero ***models.js*** en *data*

- Crear los **esquemas (user, recipe) y modelos de datos(User, Recipe)** en *models.js* // [Apuntes Mongoose](https://github.com/Yevestevez/apuntes-desarrollo-web-full-stack/blob/main/JavaScript/Base-datos-MongoDB/04-mongoose.md)

- Exportar los modelos desde *models.js* mediante ```export { User, Recipes }```

- Crear ***populate.js*** para añadir documentos a la base de datos

- Crear el directorio ***logic*** en *api*

- Crear el fichero ***registerUser*** en *logic* e implementar la lógica de registro a nivel de *api* de manera básica (sin *errors*, *validate* ni *bcrypt*)

- Crear el ficheron ***registerUser.test.js*** e implementar el *test* "rápido" de la lógica

- Generar funciones ***connectToDB*** y ***startApi*** en *index.js* para arrancar rápidamente la *api* y conectarla con *mongoose*

- Ensamblar la lógica *registerUser* en el servidor *api (index.js)* como una ruta ***api.post***

- Generar el *script* de acceso directo para arrancar la *api* y arrancar con el inspector en *package.json* ```"scripts": { "start": "node index.js", "inspect": "node --inspect-brk index.js" }``` y probar que la *api* arranca correctamente y conecta con la *db* ([Apuntes instalación y arranque db](https://github.com/Yevestevez/apuntes-desarrollo-web-full-stack/blob/main/JavaScript/Base-datos-MongoDB/02-servidor-mongodb-windows.md))

- Crear el directorio ***test*** en *api* y generar el fichero ***register-user.sh*** para probar que la lógica de *registerUser* funciona del lado del servidor en *index.js (api.post('/users'),...)*

- Generar el fichero ***register-user.js*** para probar que la lógica de *registerUser* funciona del lado del servidor en *index.js (api.post('/users'),...)* mediante ```fetch```

- Crear un ***paquete común (com)*** que contenga ***validate*** (para validar los tipos de datos permitidos en cada caso) y ***errors*** con los errores personalizados

- Generar ***validate.js*** y ***errors.js*** donde validar datos y personalizar errores

- Crear el directorio ***middlewares*** en *api* y dentro ***jsonBodyParser.js*** para "traducir" de JSON a objeto JS en las peticiones *HTTP* (lo importo en index.js para poder usarlo)

- Instalar ***bcryptjs*** (```npm i bcryptjs```), importarlo y usarlo en *register.js* para generar un *hash* que reemplace a *password* para más seguridad

- Instalar ***dotenv*** en la *api* (```npm i dotenv```), generar el fichero ***.dotenv*** y añadir el puerto que usamos en la api (```PORT = 8080```), la dirección de la base de datos (```MONGO_URL = mongodb://localhost:27017/vegazetas```) y la dirección de la *db* para test (```MONGO_URL = mongodb://localhost:27017/vegazetas-test```). 

- Importar *dotenv* en la *api* (lo antes posible, línea 1) (```import 'dotenv/config'```) y sustituir esos datos en la *api* por su acceso de *dotenv* (```process.env.XXX```)

- Implementar la lógica ***authenticateUser***

- Generar el test básico ***authenticateUser.test*** para comprobar que la lógica funciona de manera aislada

- Añadir ***authenticateUser*** al índice *(index.js)* de las lógicas

- Conectar la lógica ***authenticateUser*** a la *api* en index.js

- Generar los test para la lógica ***authenticateUser*** conectada a la *api* *(api/test/[authenticate-user.js, authenticate-user.sh])*

- Instalar ***JWT*** e implementar *JWT* en la ruta de *api* para autenticar *(users/auth)*, además de añadirlo a *dotenv* para proteger *SECRET*

- Implementar la lógica ***getUserName*** y su test aislado

- Conectar la lógica ***getUserName*** con la *api*. Generar los test para la lógica ***getUserName*** conectada a la *api* *(api/test/[get-user-name.js, get-user-name.sh])*

- implementar la ***app*** de manera básica *(npm init -y (module) / React / index.html, main.jsx y main.css / com / vite / tailwindcss / React Router DOM)*

- Enlazamos todo y empezamos a pintar *Routes* y *Route* a las **4 vistas principales** *(Landing, Register, Login y Home)*

- Mecanizar enlaces a la vista de *Register* y *Login* desde *Landing* mediante *onclick* y *props*

- Mecanizar navegación con links entre las Register y Login

- Crear formularios Register y Login (sin lógicas)

- Implementar la lógica ***RegisterUser*** en ***app*** y llamarla desde la vista *Register*

- Implementar la lógica de ***LoginUser*** en ***app*** y llamarla desde la vista *Login*

- Implementar la lógica de ***getUserName*** en ***app*** y llamarla desde la vista *Home*

- Implementar ***tests spec*** *(mocka/chai/c8)* para las 3 lógicas de usuario de la *api (authenticateUser, getUserName, RegisterUser)*

- Crear lógica ***createRecipe*** y generar su *test aislado*

- Conectar lógica ***createRecipe*** con *api* y generar *test de api*

- Crear ***spec test*** de ***createRecipe***

- Crear lógica ***getMyRecipes*** y generar su *test aislado*

- Crear lógica ***createIngredientsInRecipe*** y su *test aislado*

- Conectar lógica ***getMyRecipes*** con api y generar *test de api*

- Actualizar la lógica ***createIngredientsInRecipe*** a ***addIngredientToRecipe*** para añadir un ingrediente cada vez introduciendo los campos por parámetros

- conectar la lógica ***addIngredientToRecipe*** con la *api* y generar su test de *api*

- Crear lógica ***updateRecipe***, su test aislado, conectar con *api* y generar test de *api*

- Crear lógica ***deleteRecipe***, su test aislado, conectar con *api* y generar test de *api*

- Crear lógica ***removeIngredientFromRecipe***, su test aislado, conectar con *api* y generar test de *api*

- Crear lógica ***addStepToRecipe***, su test aislado, conectar con *api* y generar test de *api*

- Crear lógica ***removeSteptoRecipe***, su test aislado, conectar con *api* y generar test de *api*

- Generar los spec test de las lógicas que me faltan ***(addIngredienteToRecipe, addStepToRecipe, deleteRecipe, getMyRecipes, removeIngredientFromRecipe, removeStepFromRecipe, updateRecipe)***

- Trabajar **estilos** de las vistas iniciales de la app *(Landing, Register,  Login)*

- Crear el **árbol de componentes** y reflejarlo en README.md para tener clara la estructura de la app 

- Agregar lógicas ***isUserLoggedIn*** y ***logoutUser*** en *app/logic* y usar ***isUserLoggedIn*** en *App.jsx*

- Diferenciar Header en dos componentes distintos según la vista:

    - Crear Header (Menu) con ***botón logout*** y conectar lógica ***logoutUser***

    <!-- - Crear Header (resto vistas) más pequeño y con botón logout y conectar lógica logoutUser -->

- Agregar lógica ***getMyRecipes*** en *app/logic* para usarlo en *MyRecipes/RecipeThumbnail*

- Crear el componente ***Menu.jsx*** en *app* que redirige al resto de vistas *(MyRecipes, Discover...)*

- Crear el componente ***Recipe.jsx*** en *app*

- Crear el componente ***MyRecipes.jsx*** en *app*

- Llamar a ***RecipeThumbnail*** desde ***MyRecipes*** *(map)* para pintar todas las miniaturas de mis recetas

- Crear *app/views/helper* y añadir ***formatDate.js*** que luego usaré en *RecipeThumbnail* y *Recipe para mostrar* la fecha de la receta correctamente

- Implementar **link en el logo de *Header*** común, que redirige a *Menu*

- Actualizar estilos de RecipeThumbnail.jsx para que muestre las miniaturas correctamente

- Conectar RecipeThumbnail con Recipe pasando la receta por props

- Actualizar ***Recipe.jsx*** para que muestre la receta entera y aplicar estilos

- Actualizar ***populate*** con 2 usuarios y 2 recetas nuevas

- Crear lógica ***createRecipe*** en app para conectar con api

- Crear el componente ***CreateRecipe*** en app


- Mejorar la lógica de ***getMyRecipes*** para que solo traiga los campos de la receta que uso en MyRecipes

- Crear las lógicas ***getRecipeById*** y ***getUserUsername*** (en api y conectar con app)

- Mejorar el componente *Recipe* para que obtenga *recipeId* por params y traiga la receta gracias a *getRecipeById* y el username del author gracias a *getUserUsername*

- Crear las lógicas ***addImageToRecipe*** y ***addTagToRecipe*** *(api/app)* para controlar el envio de nuevas imágenes y etiquetas en el momento de crear la receta

- Conectar las lógicas ***addIngredientToRecipe, addStepToRecipe, addImageToRecipe y addTagToRecipe*** con la *app*

- Conectar CreateRecipe desde el botón "Nueva Receta" de Menu para crear nuevo borrador de receta y navegar a el borrador en modo edición

- Agregar las lógicas addImageToRecipe, addTagToRecipe y addIngredientToRecipe en el componente CreateRecipe

- Agregar la lógica addStepToRecipe en el componente CreateRecipe

- Conectar la lógica updateRecipe con el componente CreateRecipe

- Limpiar los _id y __v de recipe y author en getRecipeById

*...commit*

<!-- - Limpiar en getRecipeById el resto de _id, __v de la receta (ingredients, steps) -->

<!-- - Arreglar que se pueda dejar sin mandar el main de los ingredientes (si no se especifica por defecto debe ser true, como dice el modelo) TRATAR EL MAIN COMO BOOLEANO EN EL INPUT ¿CHECK?-->



<!-- - Actualizar el componente CreateRecipe para que admita los campos necesarios y los vaya enviando según se necesita, y también al final con el botón "Guardar receta! -->

<!-- - Crear las lógicas removeImageFromRecipe y removeTagFromRecipe  -->

<!-- - Conectar las lógicas removeIngredientFromRecipe, removeStepFromRecipe, removeImageFromRecipe y removeTagFromRecipe con app -->




<!-- - Redirigir a Login cuando, después de desconectar la app se borra sessionStorage y sigue anclada en un componente interno -->
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
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

<!-- - Generar los test para la lógica ***getUserName*** conectada a la *api* *(api/test/[get-user-name.js, get-user-name.sh])* -->
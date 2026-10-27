<p align="center">
  <img src="./doc/images/vegazeta-logo.png" alt="Vegazetas" height="100">
</p>

<h1 align="center">Vegazetas</h1>

<p align="center">
  <strong>Una forma colorida de crear, organizar y compartir recetas veganas.</strong>
  <br>
  Diseñado y desarrollado artesanalmente de principio a fin: desde Figma hasta el despliegue.
</p>

<p align="center">
  <a href="https://vegazetas.netlify.app/">Explorar Vegazetas</a>
</p>

<p align="center">
  <a href="https://github.com/Yevestevez/vegazetas">GitHub</a> ·
  <a href="https://www.linkedin.com/in/edu-yeves/">LinkedIn</a>
</p>

---

## Sobre el proyecto

Vegazetas es una aplicación web para guardar recetas veganas propias y descubrir las que publica la comunidad. La experiencia gira en torno a una interfaz expresiva y alegre, pensada para que crear y consultar recetas resulte sencillo.

Es un proyecto full-stack diseñado y desarrollado íntegramente por mí: desde el diseño UX/UI en Figma y la aplicación de una sola página hasta la API REST, la base de datos y el despliegue. El proyecto también incluye pruebas automatizadas para la lógica de negocio de la API.

## Funcionalidades

- Registro, inicio y cierre de sesión, y recuperación de contraseña.
- Creación, edición y eliminación de recetas.
- Recetas veganas con descripción, tiempo, dificultad, etiquetas, imágenes, ingredientes y pasos.
- Edición y reordenación de los pasos de preparación.
- Publicación de recetas para que otras personas puedan descubrirlas.
- Secciones para consultar las recetas propias, explorar recetas publicadas y guardar favoritas.

## Tecnologías

| Área | Tecnologías |
| --- | --- |
| Frontend | React, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express |
| Datos | MongoDB, Mongoose |
| Calidad | Mocha, Chai, c8, ESLint |

## Puesta en marcha

Necesitas Node.js, npm y una instancia de MongoDB. La aplicación y la API se ejecutan por separado.

1. Configura las variables de entorno:
   - En `api/.env`, define `MONGO_URL` y `PORT`.
   - En `app/.env`, define `VITE_API_URL` con la URL de la API.
2. Instala y ejecuta la API en una terminal:

   ```bash
   cd api
   npm install
   npm start
   ```

3. Instala y ejecuta la aplicación en otra terminal:

   ```bash
   cd app
   npm install
   npm run dev
   ```

### Pruebas y calidad

La API cuenta con pruebas automatizadas para sus lógicas de negocio, escritas con Mocha y Chai. Desde `api/`, ejecútalas con:

```bash
npm test
```

Desde `app/`, puedes comprobar el lint y generar la compilación de producción:

```bash
npm run lint
npm run build
```

## Diseño

Consulta el [prototipo de Vegazetas en Figma](https://www.figma.com/proto/wJ7OQyaNcJneXTPpf4jx6X/Vegazetas?node-id=149-214&t=m7ZNRd48c95egXOo-1&scaling=scale-down&content-scaling=fixed&page-id=149%3A212&starting-point-node-id=149%3A214).

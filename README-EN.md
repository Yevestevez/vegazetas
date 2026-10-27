<p align="center">
  <img src="./doc/images/vegazeta-logo.png" alt="Vegazetas" height="100">
</p>

<h1 align="center">Vegazetas</h1>

<p align="center">
  <strong>A colourful place to create, organise and share vegan recipes.</strong>
  <br>
  Designed and handcrafted entirely by me, from Figma to deployment.
</p>

<p align="center">
  <a href="https://vegazetas.netlify.app/">Explore Vegazetas</a>
</p>

<p align="center">
  <a href="https://github.com/Yevestevez/vegazetas">GitHub</a> ·
  <a href="https://www.linkedin.com/in/edu-yeves/">LinkedIn</a>
</p>

---

## About

Vegazetas is a web app for keeping your own vegan recipes and discovering those published by the community. Its expressive, cheerful interface is designed to make creating and browsing recipes feel simple.

I designed and built the entire full-stack project myself: from UX/UI in Figma and the single-page application to the REST API, database and deployment. The project also includes automated tests for the API's business logic.

## Features

- Sign-up, login, logout and password recovery.
- Create, edit and delete recipes.
- Add descriptions, cooking times, difficulty levels, tags, images, ingredients and steps to vegan recipes.
- Edit and reorder preparation steps.
- Publish recipes for others to discover.
- Browse personal recipes and published recipes, and save favourites.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express |
| Data | MongoDB, Mongoose |
| Quality | Mocha, Chai, c8, ESLint |

## Getting started

You will need Node.js, npm and a MongoDB instance. Run the app and API separately.

1. Configure environment variables:
   - In `api/.env`, set `MONGO_URL` and `PORT`.
   - In `app/.env`, set `VITE_API_URL` to the API URL.
2. Install and start the API in one terminal:

   ```bash
   cd api
   npm install
   npm start
   ```

3. Install and start the app in another terminal:

   ```bash
   cd app
   npm install
   npm run dev
   ```

### Tests and quality

The API includes automated tests for its business logic, written with Mocha and Chai. Run them from `api/`:

```bash
npm test
```

From `app/`, run the linter and create a production build:

```bash
npm run lint
npm run build
```

## Design

Explore the [Vegazetas Figma prototype](https://www.figma.com/proto/wJ7OQyaNcJneXTPpf4jx6X/Vegazetas?node-id=149-214&t=m7ZNRd48c95egXOo-1&scaling=scale-down&content-scaling=fixed&page-id=149%3A212&starting-point-node-id=149%3A214).

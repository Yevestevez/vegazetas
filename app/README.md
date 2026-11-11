# Vegazetas app

The Vegazetas frontend is a React single-page app built with Vite. It lets users manage recipes, including their ingredients, steps, images, and publication status.

## Run locally

Install [Node.js](https://nodejs.org/) and npm, then from this directory:

```sh
npm install
```

Create an `.env.local` file and point the app to the API:

```env
VITE_API_URL=http://localhost:3000
```

Use the same URL and port configured for the API, then start the app:

```sh
npm run dev
```

Vite serves the app at `http://localhost:5173` by default. The API and its MongoDB database must also be running.

## Scripts

- `npm run dev` — start the development server (`npm start` is an alias).
- `npm run build` — create a production build in `dist/`.
- `npm run preview` — preview the production build locally.
- `npm run lint` — run ESLint.

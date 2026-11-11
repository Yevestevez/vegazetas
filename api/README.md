# Vegazetas API

The API is an Express service backed by MongoDB. It handles users, authentication, and recipe management.

## Run locally

Install [Node.js](https://nodejs.org/) and npm, and make sure MongoDB is available. From this directory, install dependencies:

```sh
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/vegazetas
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
MAIL_FROM=noreply@example.com
```

Start the API:

```sh
npm start
```

Use `npm run watch` to restart the service when files change. The health check is available at `http://localhost:3000/health`. The frontend's `VITE_API_URL` must match the API URL.

Password recovery uses Ethereal for email previews outside production. In production, set `RESEND_API_KEY` and configure `MAIL_FROM` for Resend.

## Tests

Set `SPEC_MONGO_URL` in `.env` to a **dedicated test database** before running:

```sh
npm test
```

The tests clear user and recipe collections; never point `SPEC_MONGO_URL` at a database containing data you need to keep.

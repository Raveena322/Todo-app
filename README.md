# Todo App

Full-stack todo list application with a React frontend and an Express + MongoDB backend.

## Tech Stack
- React 19 with Vite for the client UI
- Express 5 and Mongoose 8 for the REST API
- MongoDB for persistence

## Prerequisites
- Node.js 18+
- MongoDB instance (local or hosted)

Create a `server/.env` file with your connection details:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/todos_app
# Optional when using Atlas or other clusters
# MONGODB_DB=todoapp
PORT=5000
```

## Setup

Install dependencies for both client and server:

```bash
cd server
npm install

cd ../client
npm install
```

## Running Locally

Start the API server:

```bash
cd server
npm run dev
```

In a new terminal start the Vite dev server:

```bash
cd client
npm run dev
```

The client defaults to `http://localhost:5173` and proxies API requests to the Express server at `http://localhost:5000`.

## Available Scripts

Client (`client/`):
- `npm run dev` – start Vite in development mode
- `npm run build` – build production assets
- `npm run preview` – preview the production build

Server (`server/`):
- `npm run dev` – start the server with nodemon
- `npm start` – start the server with Node.js

## Deployment Notes
- Ensure environment variables are set for `MONGODB_URI`, optional `MONGODB_DB`, and `PORT`.
- Build the client (`npm run build`) and deploy the static assets to your hosting platform of choice.
- Deploy the server to any Node-compatible platform (Render, Railway, etc.) with the correct environment variables.


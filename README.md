Deployment and Local Run Instructions

This project contains a small Express server to accept photo uploads and a static front-end (`index.html`).

Quick local run (Windows PowerShell):

1. Install dependencies and build lockfile:

```powershell
cd "C:\Users\ian nnamani\Dad's birthday e-book"
npm install
```

2. Start server:

```powershell
npm start
# opens at http://localhost:3000/index.html
```

3. Use the "+ Add photos" button to upload images; they are stored in the `uploads/` folder (excluded from git via `.gitignore`).

Notes on hosting

- Netlify: Not suitable for an Express backend unless you convert upload endpoints to Netlify Functions or use an external API. If you must use Netlify, host the backend elsewhere (e.g., Render) and point the front-end to that API.

- Render / Heroku / Fly / Railway: Recommended for this app (Node server). The repo already includes a `Procfile` for Heroku and `start` script in `package.json`.

Deploy to Render (quick):
- Create a new Web Service, connect repo, root is project root, Build Command: `npm install`, Start Command: `npm start`.

Deploy to Heroku (quick):
- Install Heroku CLI, then:

```bash
heroku create
git push heroku main
```

Important notes

- `multer` has been pinned to `1.4.5` in `package.json` to avoid ETARGET problems.
- Ensure you do not commit `uploads/` or `node_modules/` (see `.gitignore`).
- For production, consider using S3 or equivalent for durable file storage and a DB for metadata.

If you want, I can:
- Commit a regenerated `package-lock.json` here (if you grant permission to run npm),
- Add CORS or environment-based `API_BASE` configuration, or
- Convert the backend to serverless functions for Netlify.

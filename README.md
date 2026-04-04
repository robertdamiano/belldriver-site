# Bell Driver Site

Marketing website for Bell Driver Education, deployed on Firebase Hosting.

## Tech

- Static HTML/CSS/JavaScript
- Firebase Hosting

## Local development

Because this is a static site, you can open `index.html` directly or run a local static server.

Example (Python):

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Authenticate:

```bash
firebase login
```

3. Deploy hosting:

```bash
firebase deploy --only hosting --project bell-driver-site
```

## CI deploy (GitHub Actions)

This repo includes `.github/workflows/deploy.yml` to deploy on pushes to `main`.

Required GitHub secret:

- `GOOGLE_APPLICATION_CREDENTIALS` (service account JSON)

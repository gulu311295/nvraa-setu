# NVRAA SETU — MVP

Year-round alumni, mentorship and opportunity network for **JNV Rajgir / NVRAA**.

## Features

- **Gated access** — users request access at `/signup`; coordinators approve at `/coordinator` before `/login` works
- Mentorship, jobs, exam consultation, scholarships, and alumni “offer support” flows
- **Coordinator login** (`/coordinator/login`) with password protection
- **PostgreSQL** persistence for form submissions when `DATABASE_URL` is set (Railway Postgres)
- In-memory submission fallback for local dev without a database

## Local development

Full checklist: **[LOCAL.md](./LOCAL.md)**

```bash
npm install
npm run dev
```

Use the URL printed in the terminal (if port 3000 is busy, Next.js picks 3001, 3002, …).

- Coordinator: `/coordinator/login`
- Local password (`.env.local` on your machine): **`setu-local-2026`**
- Without `.env.local`, dev fallback password: `nvraa-demo`

## Repository

**https://github.com/gulu311295/nvraa-setu**

Step-by-step Railway setup: see [DEPLOY.md](./DEPLOY.md).

## Deploy on Railway

1. Open the GitHub repo above and create a **Railway** project from it.
2. Add **PostgreSQL** (Plugins → PostgreSQL). Railway injects `DATABASE_URL` into the web service.
3. Set variables on the web service:
   - `COORDINATOR_PASSWORD` — shared secret for NVRAA coordinators
   - `SESSION_SECRET` — random string (e.g. `openssl rand -hex 32`)
4. Deploy. Nixpacks runs `npm run build`; start command is `npm run start`.

The `submissions` table is created automatically on first form post.

## Privacy

Public pages use fictional demo mentor/job data. Real form data belongs in the coordinator dashboard only.

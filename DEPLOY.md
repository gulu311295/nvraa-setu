# Deploy NVRAA SETU on Railway

GitHub repo: **https://github.com/gulu311295/nvraa-setu**

## Option A — Railway dashboard (recommended)

1. Sign in at [railway.com](https://railway.com) (GitHub login works).
2. **New Project** → **GitHub Repository** → choose `gulu311295/nvraa-setu`.
3. Railway builds with Nixpacks (`npm run build`, `npm run start` from `railway.toml`).
4. In the project, click **+ New** → **Database** → **PostgreSQL**.
5. Open the **web service** → **Variables** → **Add references** → attach `DATABASE_URL` from Postgres (or use Railway’s “Connect Postgres” shortcut).
6. Add these variables on the **web service**:

   | Variable | Value |
   |----------|--------|
   | `COORDINATOR_PASSWORD` | Strong password for `/coordinator/login` |
   | `SESSION_SECRET` | Random string, e.g. `openssl rand -hex 32` |

7. **Settings** → **Networking** → **Generate domain** for public HTTPS URL.
8. Redeploy if needed; open the URL and test a form, then sign in as coordinator.

## Option B — Railway CLI

```bash
npm i -g @railway/cli   # or: brew install railway
railway login           # opens browser — must run in your terminal
cd /path/to/nvraa-setu
railway init            # create/link project
railway add -d postgres
railway variables set COORDINATOR_PASSWORD="your-password" SESSION_SECRET="$(openssl rand -hex 32)"
railway up
railway domain          # optional public URL
```

## GitHub Actions (optional auto-deploy)

1. Railway → **Account Settings** → **Tokens** → create a token.
2. GitHub repo → **Settings** → **Secrets** → `RAILWAY_TOKEN`.
3. After the project exists, copy the **service ID** from Railway service settings → secret `RAILWAY_SERVICE_ID`.
4. Push to `main`; workflow `.github/workflows/railway-deploy.yml` runs `railway redeploy`.

Without `RAILWAY_TOKEN` / `RAILWAY_SERVICE_ID`, the workflow is skipped (dashboard deploy still works).

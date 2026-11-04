# Deploy NVRAA SETU on Railway

GitHub repo: **https://github.com/gulu311295/nvraa-setu**

## Option A — Railway dashboard (recommended)

1. Sign in at [railway.com](https://railway.com) (GitHub login works).
2. **New Project** → **GitHub Repository** → choose `gulu311295/nvraa-setu` (branch `main`).
3. Railway builds with Nixpacks (`npm run build`, `npm run start` from `railway.toml`).
4. In the project, click **+ New** → **Database** → **PostgreSQL**.
5. Open the **web service** → **Variables** → **Connect Postgres** (or **Add reference** → `DATABASE_URL` from the Postgres service).
6. Add these variables on the **web service** (do not commit secrets to git):

   | Variable | Value |
   |----------|--------|
   | `COORDINATOR_PASSWORD` | Strong password for `/coordinator/login` |
   | `SESSION_SECRET` | Random string, e.g. `openssl rand -hex 32` |

   `DATABASE_URL` comes from Postgres. Tables (`submissions`, `member_users`) are created automatically on first use.

7. **Settings** → **Networking** → **Generate domain** for public HTTPS URL.
8. Wait for deploy to finish (health check hits `/login`).
9. Smoke test:
   - **`/signup`** → request access
   - **`/coordinator/login`** → approve member under **Member sign-ups**
   - **`/login`** → sign in → submit **`/scholarship`** or **`/mentorship`**
   - **`/coordinator`** → review form submissions in the queues

## Option B — Railway CLI

```bash
npm i -g @railway/cli   # or: brew install railway
railway login           # opens browser — run in your terminal
cd /path/to/nvraa
railway link            # link existing project, or: railway init
railway add -d postgres # if Postgres not added yet
railway variables set COORDINATOR_PASSWORD="your-password" SESSION_SECRET="$(openssl rand -hex 32)"
# Attach DATABASE_URL from Postgres in dashboard, or reference via Railway UI
railway up
railway domain          # public URL
```

## GitHub Actions (optional redeploy)

1. Railway → **Account Settings** → **Tokens** → create a token.
2. GitHub repo → **Settings** → **Secrets** → `RAILWAY_TOKEN`.
3. Copy **service ID** from Railway web service → secret `RAILWAY_SERVICE_ID`.
4. **Actions** → **Deploy to Railway** → **Run workflow** (or push after wiring secrets).

Without secrets, use dashboard deploy on push to `main` (if repo is connected).

## Counselling mentor contacts (private)

Public mentor profiles live in `data/counselling-mentors.json` (no email/phone). Private contacts are generated from `Contact list.xlsx` into **`data/mentor-contacts.private.json`** (gitignored).

After deploy, seed mentor contacts (pick one):

**Option A — Railway variable (recommended for production)**

On the **nvraa-setu** web service, set `MENTOR_CONTACTS_JSON` to the compact JSON from `data/mentor-contacts.private.json` (generate locally with `npm run import:mentors`). The app auto-imports into Postgres on first lookup when the table is empty.

**Option B — Postgres push from your machine**

Railway Postgres → **Networking** → enable public URL, then:

```bash
npm run import:mentors
DATABASE_URL="postgresql://..." npm run import:mentors -- --push-db
```

Until seeded, approved students will not see email/phone even when a mentor is assigned.

## Notes

- **Member access** and **form submissions** both persist in Postgres when `DATABASE_URL` is set.
- Without Postgres, production would use ephemeral local files — always connect Postgres on Railway.
- If Postgres SSL errors appear, Railway’s default `DATABASE_URL` is usually enough; only set `PGSSL=false` if Railway docs say so for your plugin.

# Local testing

## Start

```bash
cd ~/Desktop/nvraa
npm install   # first time only
npm run dev
```

Open the URL printed in the terminal (often `http://localhost:3000`). If 3000 is busy, Next.js uses 3001, 3002, etc.

## Coordinator login

A `.env.local` file is configured for local runs (not committed to git):

| Variable | Local value |
|----------|-------------|
| `COORDINATOR_PASSWORD` | `setu-local-2026` |

Sign in at **/coordinator/login**, then open **/coordinator** to see incoming form submissions (in-memory until you restart the dev server).

## Demo script (5 min)

1. **/** — skim stats and four doors  
2. **/mentorship** — filter Civil Services, submit a mentor request (use demo names only)  
3. **/jobs** — browse listings, optional job seeker form  
4. **/coordinator/login** → password above → confirm submission appears in the table  
5. **Sign out** from the coordinator dashboard  

## Production build (optional)

```bash
npm run build && npm run start
```

Runs on port 3000 by default.

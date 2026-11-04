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

## Member access (gate)

The site is **not public**. Flow:

1. **/signup** — request access (stored as pending)
2. **/coordinator/login** → approve the member under **Member access requests**
3. **/login** — user signs in only after approval

## Demo script (5 min)

1. **/signup** — create a test account  
2. **/coordinator/login** → approve your account → approve a mentorship form if needed  
3. **/login** → enter the site → **/mentorship** — submit a mentor request  
4. Coordinator dashboard — review mentorship queue  
5. **Sign out** (header) when done  

## Production build (optional)

```bash
npm run build && npm run start
```

Runs on port 3000 by default.

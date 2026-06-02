# Plesk Deployment Guide for Anelyria (Single App Architecture)

## Prerequisites
- MariaDB 10.6+
- Node.js 20+
- Two domains/subdomains: `anelyria.de` and `app.anelyria.de`

## Database Setup
1. Create a Master Database in Plesk (e.g., `anelyria_master`).
2. Create a database user with full privileges to create other databases (required for tenant provisioning).
3. Update `.env` with `MASTER_DATABASE_URL="mysql://user:pass@localhost:3306/anelyria_master"`.

## Single Node.js App Configuration
1. Create one domain `anelyria.de` — this is the primary Node.js app.
2. Add subdomain `app.anelyria.de` pointing to the same document root.

### Main Domain (anelyria.de)
1. In Plesk, add the domain `anelyria.de`.
2. Go to **Node.js** and enable it.
3. Set the **Application Root** to `/httpdocs`.
4. Set the **Document Root** to `/httpdocs/server/public`.
5. Set the **Application Startup File** to `server/dist/index.js`.
6. Add Environment Variables (copy from `.env`):
   - `VITE_APP_MODE=main`
   - `MASTER_DATABASE_URL=...`
   - `JWT_SECRET=...`
   - `SETUP_KEY=...`
   - All other env vars from `.env`

### App Subdomain (app.anelyria.de)
1. In Plesk, add the subdomain `app.anelyria.de`.
2. Go to **Hosting Settings** — set **Document Root** to `/httpdocs/server/public` (same as main).
3. **Do NOT enable a separate Node.js app.** The subdomain shares the main Node.js application.

## Build & Deploy Steps (no SSH needed)
1. Upload code via Plesk Git or File Manager.
2. Set environment variables in Plesk Node.js panel (or create `.env` file).
3. Click **npm install** in Plesk Node.js panel (or run via terminal if available).
4. Click **npm run build** in Plesk Node.js panel.
5. Go to Plesk Node.js panel → **Run script**: `cd server && npm run db:migrate:master`
6. Go to Plesk Node.js panel → **Run script**: `cd server && npm run db:seed:master`
7. Click **Apply** to start the Node.js app.

## Important Notes
- The Document Root is `/httpdocs/server/public` for BOTH domains.
- Only the main domain (`anelyria.de`) has Node.js enabled — the subdomain (`app.anelyria.de`) shares it.
- `VITE_APP_MODE=main` builds both the landing page AND the app UI into a single build.
- The Express server handles routing: `/lyriabuilder/*` → LyriaBuilder, `/app/*` → Tenant Dashboard, `/login` → Login, `/` → Landing Page.
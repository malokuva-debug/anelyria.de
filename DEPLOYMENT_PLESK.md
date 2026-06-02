# Anelyria Platform — Plesk Deployment Guide

> **Deploy the Anelyria multi-tenant performance platform as a single Node.js app on Plesk hosting.**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Domain Setup](#3-domain-setup)
4. [Create MariaDB Databases](#4-create-mariadb-databases)
5. [Upload Files](#5-upload-files)
6. [Configure Environment Variables](#6-configure-environment-variables)
7. [Install Dependencies & Build](#7-install-dependencies--build)
8. [Run Master Database Migrations](#8-run-master-database-migrations)
9. [Seed Super Admin](#9-seed-super-admin)
10. [Configure Node.js App in Plesk](#10-configure-nodejs-app-in-plesk)
11. [Set Up Subdomain (app.anelyria.de)](#11-set-up-subdomain-appanelyriade)
12. [Configure Plesk SMTP Mail](#12-configure-plesk-smtp-mail)
13. [Enable HTTPS with Let's Encrypt](#13-enable-https-with-lets-encrypt)
14. [Create First Tenant](#14-create-first-tenant)
15. [Verify Everything Works](#15-verify-everything-works)
16. [Troubleshooting](#16-troubleshooting)
17. [Security Considerations](#17-security-considerations)
18. [Maintenance & Backup](#18-maintenance--backup)

---

## 1. Overview

Anelyria runs as a **single Node.js application** in Plesk:

- **One codebase, one Node.js app** serving both the landing page (LyriaBuilder) and the tenant dashboard SPA
- **Frontend** is built by Vite into `server/public/` (the document root)
- **Backend** is a TypeScript Express server compiled to `server/dist/`
- **Two domains** (`anelyria.de` and `app.anelyria.de`) point to the same document root — the app handles routing internally based on the path
- **No SSH required** — all operations can be done via Plesk UI

---

## 2. Prerequisites

**Plesk Server Requirements:**
- Plesk Obsidian (18.x or later) with **Node.js Toolkit** extension installed
- MariaDB 10.6+ (or MySQL 8.0+) — included with Plesk
- Node.js 20.x or newer (install via Plesk Node.js Toolkit)
- SMTP mail service (Plesk Mail or external)

---

## 3. Domain Setup

You need two domains/subdomains pointing to the same server:

| Domain | Purpose | DNS Record |
|--------|---------|------------|
| `anelyria.de` | Landing page + LyriaBuilder | `A` record → server IP |
| `app.anelyria.de` | Tenant dashboard | `CNAME` → `anelyria.de` (or `A` → same IP) |

### In Plesk:

1. Go to **Websites & Domains** → **Add Domain**
2. Add `anelyria.de` as the primary domain
3. Go to **Websites & Domains** → **anelyria.de** → **Hosting Settings**
4. Set **Document root** to: `/httpdocs/server/public`
5. Go to **Websites & Domains** → **anelyria.de** → **Add Subdomain**
6. Add `app` as a subdomain
7. In **Hosting Settings** for `app.anelyria.de`, set **Document root** to the **same** `/httpdocs/server/public`

> **Important:** Both domains share the same document root. The Node.js application handles SPA routing based on the URL path. The `VITE_APP_MODE` build-time variable determines which frontend mode is served — it's set once during build and both domains serve the same build.

---

## 4. Create MariaDB Databases

You need at least **one** database (the master database). Tenant databases are created automatically on demand.

### 4.1 Master Database (`anelyria_master`)

Holds routing information (email → tenant mapping), super admin accounts, and tenant connection details.

### Steps:

1. In Plesk, go to **Databases** → **Add Database**
2. Create `anelyria_master`:
   - **Database name:** `anelyria_master`
   - **Database user:** `anelyria_master_user`
   - **Generate a strong password** and save it securely
3. Create a dedicated database user for tenant provisioning:
   - **Database user:** `anelyria_admin`
   - Grant this user `CREATE`, `DROP`, `ALTER`, `INDEX`, `SELECT`, `INSERT`, `UPDATE`, `DELETE` on `*.*` (or at least on `anelyria_%` databases)
   - This user is used by the app to provision new tenant databases automatically

Save these credentials — you'll need them in `.env`.

---

## 5. Upload Files

### Option A: Plesk Git (recommended — no SSH needed)

1. Go to **Websites & Domains** → **anelyria.de** → **Git**
2. Add your repository URL (e.g., `https://github.com/your-org/anelyria-platform.git`)
3. Select branch (e.g., `main`) and click **Fetch & Pull**
4. Files will be in `/httpdocs`

### Option B: Plesk File Manager

1. Go to **Websites & Domains** → **anelyria.de** → **File Manager**
2. Upload the entire project (or use the **Clone Repository** feature)

After upload, the project structure should be at `/httpdocs/`:

```
/httpdocs/
├── package.json          # Root — frontend deps (NO Prisma here)
├── .env                  # Environment file (copied from .env.example)
├── src/                  # Frontend React source
├── server/
│   ├── package.json      # Server — all backend deps including Prisma
│   ├── public/           # Built frontend assets (Document Root)
│   ├── prisma-master/    # Master DB Prisma schema
│   │   └── schema.prisma
│   ├── prisma/           # Master seed script
│   │   └── seed-master.ts
│   ├── src/              # Express server source
│   └── dist/             # Compiled server JS (after build)
├── prisma/               # Tenant DB Prisma schema
│   └── schema.prisma
└── ...
```

---

## 6. Configure Environment Variables

Copy the example environment file:

```bash
# Via Plesk File Manager, copy .env.example to .env
# OR if you have SSH (optional):
cd /httpdocs
cp .env.example .env
```

Edit the following variables with your Plesk values (use Plesk's Node.js environment variables editor or Plesk File Manager):

```bash
# Application
NODE_ENV=production
PORT=3001
VITE_API_URL=/api
VITE_APP_URL=https://anelyria.de
VITE_APP_MODE=main

# Master Database
MASTER_DATABASE_URL="mysql://anelyria_master_user:YOUR_PASSWORD@localhost:3306/anelyria_master"

# Database root (for provisioning new tenant databases)
MASTER_DB_USER=anelyria_admin
MASTER_DB_PASSWORD=your_admin_password
TENANT_DB_HOST=localhost

# JWT — generate with: openssl rand -base64 48
JWT_SECRET="your-64-char-random-string-here"

# Setup Key (for first super admin registration via API)
SETUP_KEY="your-random-setup-key-here"

# Email (Plesk SMTP)
SMTP_HOST=smtp.anelyria.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@anelyria.de
SMTP_PASS=your-smtp-password
EMAIL_FROM="noreply@anelyria.de"
EMAIL_FROM_NAME="Anelyria"

# CORS — allow both domains
CORS_ORIGIN=https://anelyria.de,https://app.anelyria.de

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

> **Important:** `VITE_APP_MODE=main` builds the frontend for BOTH landing page AND app mode. The single build handles both `anelyria.de` and `app.anelyria.de` requests.

---

## 7. Install Dependencies & Build

This is the only npm command you need to run. It handles everything:

```bash
cd /httpdocs
npm install
```

This single command:
1. Installs frontend dependencies from the root `package.json`
2. Automatically runs `cd server && npm install` (via `postinstall` script)
3. The server `postinstall` automatically generates both Prisma clients

Then build everything:

```bash
npm run build
```

This single command:
1. Builds the Vite frontend into `server/public/`
2. Compiles the TypeScript server code into `server/dist/`
3. Regenerates both Prisma clients with the latest schema

> **Note:** You can run these from Plesk's **Node.js** panel by clicking the **npm install** and **npm run build** buttons, or via the Plesk File Manager's terminal if available.

---

## 8. Run Master Database Setup

Create the tables in `anelyria_master`. Since the project uses Prisma with a schema-first approach, use `db push` for initial deployment:

```bash
cd /httpdocs/server
npm run db:push:master
```

This synchronizes `prisma-master/schema.prisma` with your master database, creating `UserRoute`, `SuperAdmin`, and `Tenant` tables. (If you have existing migration files later, use `npm run db:migrate:master` instead.)

---

## 9. Seed Super Admin

Create the initial super admin account so you can log into LyriaBuilder:

```bash
cd /httpdocs/server
npm run db:seed:master
```

This creates a super admin with:
- **Email:** `valmir.malooku@icloud.com`
- **Password:** `Lenoxvm123.`

> **Important:** Change the credentials in `server/prisma/seed-master.ts` before running if you want different credentials. The script checks for existing super admins and won't create duplicates.

### Alternative: Using the API endpoint

If you prefer to use the API (requires the server to be running):

```bash
curl -X POST https://anelyria.de/api/auth/register-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "valmir.malooku@icloud.com",
    "password": "Lenoxvm123.",
    "name": "Super Admin",
    "setupKey": "your-setup-key-from-env"
  }'
```

---

## 10. Configure Node.js App in Plesk

1. Go to **Websites & Domains** → **anelyria.de** → **Node.js**
2. **Enable Node.js** by toggling the switch
3. Fill in the settings:

| Setting | Value |
|---------|-------|
| **Application root** | `/httpdocs` |
| **Application startup file** | `server/dist/index.js` |
| **Application mode** | `production` |
| **Document root** | `/httpdocs/server/public` |
| **Environment variables** | Copy from your `.env` file (use the **Add Variable** button) |

4. Click **Apply** to start the Node.js application.

> **Important:** The application root must be `/httpdocs` (NOT `/httpdocs/server`) because the Express server needs access to both the root `.env` file and the `server/` directory.

---

## 11. Set Up Subdomain (app.anelyria.de)

1. Go to **Websites & Domains** → **app.anelyria.de**
2. **Do NOT enable a separate Node.js app** — the subdomain shares the main Node.js application
3. Go to **Hosting Settings**
4. Set **Document root** to: `/httpdocs/server/public` (same as main domain)

Both domains now serve the same SPA build. The Express server handles routing based on the URL path:
- `/` → Landing page (index.html)
- `/lyriabuilder/login` → LyriaBuilder login
- `/lyriabuilder/*` → LyriaBuilder dashboard
- `/login` → Tenant dashboard login
- `/app/*` → Tenant dashboard (authenticated)

---

## 12. Configure Plesk SMTP Mail

(Same as standard Plesk SMTP configuration — add the mail settings to your `.env` as shown in step 6.)

---

## 13. Enable HTTPS with Let's Encrypt

1. Go to **Websites & Domains** → **anelyria.de** → **SSL/TLS Certificates**
2. Click **Let's Encrypt**
3. Enter the admin email address
4. Check both `anelyria.de` and `www.anelyria.de` (and `app.anelyria.de` separately below)
5. Click **Install**

Repeat for the `app.anelyria.de` subdomain.

> **Note:** HTTPS is essential for production. The JWT tokens and passwords are transmitted over the wire.

---

## 14. Create First Tenant

1. Visit `https://anelyria.de/lyriabuilder/login`
2. Log in with the super admin credentials from step 9
3. Click **Create Tenant**
4. Fill in:
   - **Organization Name:** e.g., "Acme Corp"
   - **Slug:** e.g., "acme" (used in URLs and database names)
   - **Manager Email:** the first admin user's email
   - **Manager Password:** initial password for the tenant admin
5. Click **Create** — the system will:
   - Create a new MariaDB database (`anelyria_acme`)
   - Run Prisma migrations on it
   - Create the admin user
   - Register the routing entry
6. The tenant admin can now log in at `https://app.anelyria.de/login`

---

## 15. Verify Everything Works

### Check 1: API Health
```bash
curl https://anelyria.de/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Check 2: Landing Page
Visit `https://anelyria.de` — you should see the Anelyria landing page with "Sign In" button.

### Check 3: LyriaBuilder Login
Visit `https://anelyria.de/lyriabuilder/login` — log in with super admin credentials.

### Check 4: Tenant Login
Visit `https://app.anelyria.de/login` — log in with a tenant user's credentials.

### Check 5: Static Assets
```bash
curl -I https://anelyria.de/assets/index-*.js
# Should return 200 OK
```

---

## 16. Troubleshooting

### 16.1 "Cannot find module" errors

**Problem:** Server fails to start because Prisma client is not generated.

**Solution:** Regenerate Prisma clients:
```bash
cd /httpdocs/server
npm run db:generate
```

### 16.2 Server crashes immediately

**Problem:** The Node.js app fails to start.

**Solutions:**
- Check the Node.js app log in Plesk: **Websites & Domains** → **anelyria.de** → **Node.js** → **Logs**
- Ensure `MASTER_DATABASE_URL` in the environment variables is correct
- Ensure the master database exists and is accessible
- Ensure `server/dist/index.js` exists (run `npm run build` from the root)

### 16.3 White screen or 404 on page reload

**Problem:** SPA routes aren't loading when refreshing the page.

**Solutions:**
- Ensure `server/public/` exists with `index.html`
- Check Express static serving path in `server/src/index.ts`: `path.join(__dirname, '../public')`
- Verify Plesk Document Root is set to `/httpdocs/server/public`
- The catch-all route `app.get('*')` in `server/src/index.ts` serves `index.html` for all non-API routes — this handles SPA routing

### 16.4 Prisma migration fails

**Problem:** `prisma migrate deploy` fails.

**Solutions:**
- Ensure the `MASTER_DATABASE_URL` env var is set and the database exists
- If this is the initial deployment, use `npm run db:push:master` instead (creates tables directly from the schema)
- If you need initial migration files, run locally first: `cd server && npx prisma migrate dev --schema=prisma-master/schema.prisma --name init`
- Then push those migration files to the server

### 16.5 Node.js version compatibility

**Problem:** Prisma fails to generate or run on Node.js 25+.

**Solution:** The `server/package.json` uses `@prisma/client: ^6.5.0` and `prisma: ^6.5.0` which support Node.js 25. If you're on an older Node.js, update the version constraint to match.

### 16.6 "VITE_APP_MODE" not working

**Problem:** The frontend shows the wrong mode (e.g., tenant dashboard on the landing page).

**Solution:** The `VITE_APP_MODE` must be set **at build time** — it's a Vite environment variable (uses `import.meta.env`). Set it in the environment before running `npm run build`, or use the specific build script: `npm run build:main` (or `npm run build:app` for the app-only build).

---

## 17. Security Considerations

- **HTTPS only** — always use Let's Encrypt for both domains
- **JWT Secret** — use a strong random string (64+ characters)
- **Setup Key** — change the `SETUP_KEY` environment variable, keep it secret
- **Rate limiting** — enabled by default on all API endpoints
- **Helmet** — security headers are applied automatically
- **Database credentials** — use unique, strong passwords per database
- **BCrypt** — all passwords are hashed with bcrypt (10 rounds)
- **Regular updates** — keep the platform updated with `git pull`

---

## 18. Maintenance & Backup

### Updating the Platform

```bash
# Via Plesk Git:
cd /httpdocs
# Click "Fetch & Pull" in Plesk Git UI

# Then redeploy:
npm install
npm run build

# Apply any new migrations:
cd /httpdocs/server
npm run db:migrate:master

# Restart the Node.js app (Plesk Node.js panel → Restart)
```

### Database Backups

Use Plesk's built-in database backup:
1. Go to **Websites & Domains** → **anelyria.de** → **Databases**
2. Select `anelyria_master` → **Backup**
3. Also back up each tenant database individually

### Logs

- Plesk Node.js log: **Websites & Domains** → **anelyria.de** → **Node.js** → **Logs**
- Application logs: visible in the Node.js panel output
- Access logs: standard Plesk access logs

---

## Appendix: Quick-Start Checklist

- [ ] Domain `anelyria.de` added in Plesk
- [ ] Subdomain `app.anelyria.de` added in Plesk
- [ ] MariaDB database `anelyria_master` created
- [ ] Database user `anelyria_admin` created with `CREATE` privileges
- [ ] Files uploaded via Git or File Manager
- [ ] `.env` file configured
- [ ] Node.js app enabled (root: `/httpdocs`, startup: `server/dist/index.js`)
- [ ] Document root set to `/httpdocs/server/public` (both domains)
- [ ] `npm install && npm run build` executed
- [ ] `npm run db:migrate:master` executed
- [ ] `npm run db:seed:master` executed
- [ ] HTTPS enabled via Let's Encrypt
- [ ] Node.js app started (click Apply)
- [ ] Login at `https://anelyria.de/lyriabuilder/login`
- [ ] Create first tenant
- [ ] Test tenant login at `https://app.anelyria.de/login`
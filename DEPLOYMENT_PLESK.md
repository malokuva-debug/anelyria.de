# Anelyria Platform — A–Z Plesk Deployment Guide

> **Deploy the Anelyria multi-tenant performance platform on Plesk hosting (or any Node.js/MariaDB host).**

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Domain Setup](#2-domain-setup)
3. [Create MariaDB Databases](#3-create-mariadb-databases)
4. [Upload Files](#4-upload-files)
5. [Install Dependencies](#5-install-dependencies)
6. [Configure Environment](#6-configure-environment)
7. [Build the Frontend](#7-build-the-frontend)
8. [Generate Prisma Client & Migrate Master DB](#8-generate-prisma-client--migrate-master-db)
9. [Seed Super Admin](#9-seed-super-admin)
10. [Configure Node.js App in Plesk](#10-configure-nodejs-app-in-plesk)
11. [Configure Plesk SMTP Mail](#11-configure-plesk-smtp-mail)
12. [Set Up Subdomain (app.anelyria.de)](#12-set-up-subdomain-appanelyriade)
13. [Enable HTTPS with Let's Encrypt](#13-enable-https-with-lets-encrypt)
14. [Create First Tenant](#14-create-first-tenant)
15. [Verify Everything Works](#15-verify-everything-works)
16. [Troubleshooting](#16-troubleshooting)
17. [Security Considerations](#17-security-considerations)
18. [Maintenance & Backup](#18-maintenance--backup)

---

## 1. Prerequisites

**Plesk Server Requirements:**
- Plesk Obsidian (18.x or later) with **Node.js Toolkit** extension installed
- MariaDB 10.6+ (or MySQL 8.0+) — included with Plesk
- Node.js 20.x LTS (install via Plesk Node.js Toolkit)
- Git (optional, for pulling code directly)
- SMTP mail service (Plesk Mail or external)

**Local Machine Requirements:**
- Node.js 20.x LTS
- npm 10+
- Git
- SSH client (for remote Plesk access)

---

## 2. Domain Setup

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

> **Note:** The Document Root is set to `server/public` because that is where Vite builds the frontend assets. The Node.js application will also serve these files and handle SPA routing.

---

## 3. Create MariaDB Databases

You need two databases:

### 3.1 Master Database (`anelyria_master`)

Holds routing information (email → tenant mapping), super admin accounts, and tenant connection details.

### 3.2 First Tenant Database (e.g., `anelyria_acme`)

Will be created automatically when you provision a tenant via LyriaBuilder — but you need the master database first.

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

## 4. Upload Files

### Option A: Git Clone (via Plesk Git)

1. Go to **Websites & Domains** → **anelyria.de** → **Git**
2. Add your repository URL (e.g., `https://github.com/your-org/anelyria-platform.git`)
3. Select branch (e.g., `main`) and click **Fetch & Pull**
4. Files will be in `/httpdocs`

### Option B: SCP / FTP

```bash
# From your local machine, build first
npm ci
npm run build

# Upload everything except node_modules
scp -r . plesk-user@anelyria.de:/httpdocs/
```

### Option C: Plesk File Manager

1. Go to **Websites & Domains** → **anelyria.de** → **File Manager**
2. Upload the entire project (or use the **Clone Repository** feature in File Manager)

After upload, the project structure should be at `/httpdocs/`:

```
/httpdocs/
├── package.json       # Frontend package.json (no Prisma here!)
├── .env.example → .env (copy)
├── src/               # Frontend source
├── server/
│   ├── package.json   # Server package.json (Prisma is here!)
│   ├── public/        # Built frontend assets (Document Root)
│   ├── prisma-master/
│   │   └── schema.prisma
│   └── src/
│       └── ...
├── prisma/            # Tenant Prisma schema
│   └── schema.prisma
└── ...
```

---

## 5. Install Dependencies

The platform has two sets of dependencies:

### 5.1 Frontend Dependencies (Project Root)

```bash
cd /httpdocs
npm install
```

### 5.2 Server Dependencies

```bash
cd /httpdocs/server
npm install
```

---

## 6. Configure Environment

```bash
cd /httpdocs
cp .env.example .env
nano .env
```

Edit the following variables with your Plesk values:

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

# Setup Key for first super admin registration
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

---

## 7. Build the Frontend

```bash
cd /httpdocs

# Build the SPA (uses VITE_APP_MODE=main from .env)
npm run build
```

This generates the production build in `/httpdocs/server/public/`:
- `server/public/index.html` — the SPA entry point
- `server/public/assets/*.js` — bundled JavaScript
- `server/public/assets/*.css` — bundled CSS

---

## 8. Generate Prisma Client & Migrate Master DB

### 8.1 Generate the main Prisma client (for tenant databases)

```bash
cd /httpdocs/server
npx prisma generate --schema=../prisma/schema.prisma
```

### 8.2 Generate the master Prisma client (for routing/super admin)

```bash
cd /httpdocs/server
npx prisma generate --schema=prisma-master/schema.prisma
```

### 8.3 Run master database migrations

```bash
cd /httpdocs/server
npx prisma migrate deploy --schema=prisma-master/schema.prisma
```

---

## 9. Seed Super Admin

The first super admin must be created manually. Use the built-in seed script or run via the setup endpoint:

### Option A: Using the API (recommended)

The Express server provides a `POST /api/auth/register-first-admin` endpoint:

```bash
curl -X POST https://anelyria.de/api/auth/register-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@anelyria.de",
    "password": "YourSecurePassword123!",
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
| **Environment variables** | Copy from your `.env` file |

### Important: Build the Server First

The server TypeScript needs to be compiled to JavaScript:

```bash
cd /httpdocs/server
npx tsc
```

This creates `/httpdocs/server/dist/index.js` and the rest of the compiled server code.

4. Click **Apply** to start the Node.js application.

---

## 11. Configure Plesk SMTP Mail

(Same as before...)

---

## 12. Set Up Subdomain (app.anelyria.de)

Both domains serve the same SPA. The app handles routing internally.

In **Hosting Settings** for `app.anelyria.de`:
- **Document root:** `/httpdocs/server/public` (same as main domain)
- Ensure Node.js is enabled and configured same as the main domain.

---

## 13. Enable HTTPS with Let's Encrypt

(Same as before...)

---

## 14. Create First Tenant

(Same as before...)

---

## 15. Verify Everything Works

(Same as before...)

---

## 16. Troubleshooting

### 16.1 "Cannot find module" errors

**Problem:** Server fails to start because Prisma client is not generated.

**Solution:**
```bash
cd /httpdocs/server
npx prisma generate --schema=prisma-master/schema.prisma
npx prisma generate --schema=../prisma/schema.prisma
```

### 16.3 App shows white screen / 404

**Problem:** SPA routes aren't loading.

**Solutions:**
- Ensure `server/public/` exists with `index.html`
- Check Express static serving path in `server/src/index.ts`: `path.join(__dirname, '../public')`
- Verify Plesk Document Root is set to `/httpdocs/server/public`

---

(Rest of the file remains similar...)

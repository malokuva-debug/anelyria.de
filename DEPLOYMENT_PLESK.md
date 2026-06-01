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
4. Ensure document root is set to: `/httpdocs`
5. Go to **Websites & Domains** → **anelyria.de** → **Add Subdomain**
6. Add `app` as a subdomain
7. In **Hosting Settings** for `app.anelyria.de`, set document root to the **same** `/httpdocs` (or `/httpdocs/dist` if preferred)

> **Note:** Because both domains serve the same SPA, they share the same document root. The Node.js app handles all routing.

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
├── package.json
├── .env.example → .env (copy)
├── dist/              # Built frontend
├── server/
│   ├── package.json
│   ├── prisma-master/
│   │   └── schema.prisma
│   └── src/
│       └── ...
├── prisma/
│   └── schema.prisma
└── ...
```

---

## 5. Install Dependencies

The platform has two sets of dependencies:

### 5.1 Frontend + Main Prisma

```bash
cd /httpdocs
npm ci --omit=dev
```

### 5.2 Server Dependencies

```bash
cd /httpdocs/server
npm ci --omit=dev
```

> **Note:** In production, use `npm ci` for reproducible builds. If you don't have a lockfile, use `npm install --production`.

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

# Install production-only frontend deps if not already done
npm ci --omit=dev

# Build the SPA (uses VITE_APP_MODE=main from .env)
npm run build
```

This generates the production build in `/httpdocs/dist/`:
- `dist/index.html` — the SPA entry point
- `dist/assets/*.js` — bundled JavaScript
- `dist/assets/*.css` — bundled CSS

---

## 8. Generate Prisma Client & Migrate Master DB

### 8.1 Generate the main Prisma client (for tenant databases)

```bash
cd /httpdocs
npx prisma generate
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

### 8.4 Create the master database tables

If you're starting fresh, you can also push the schema directly:

```bash
cd /httpdocs/server
npx prisma db push --schema=prisma-master/schema.prisma
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

This will:
1. Verify no super admin exists yet
2. Verify the setup key matches `.env`
3. Create the super admin and return a JWT

### Option B: Manual Node.js Script

Create a file `seed-master.js` in `/httpdocs/server`:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.MASTER_DATABASE_URL } }
});

async function seed() {
  const hash = await bcrypt.hash('YourSecurePassword123!', 10);
  await prisma.superAdmin.create({
    data: {
      email: 'admin@anelyria.de',
      passwordHash: hash,
      name: 'Super Admin',
    }
  });
  console.log('Super admin created!');
  await prisma.$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
```

Run it:

```bash
cd /httpdocs/server
MASTER_DATABASE_URL="mysql://anelyria_master_user:pass@localhost:3306/anelyria_master" \
  node seed-master.js
```

---

## 10. Configure Node.js App in Plesk

This is the most critical step. In Plesk, configure the Node.js application:

1. Go to **Websites & Domains** → **anelyria.de** → **Node.js**
2. **Enable Node.js** by toggling the switch
3. Fill in the settings:

| Setting | Value |
|---------|-------|
| **Application root** | `/httpdocs/server` |
| **Application startup file** | `dist/index.js` |
| **Application mode** | `production` |
| **Environment variables** | Copy from your `.env` file |

### Important: Build the Server First

The server TypeScript needs to be compiled to JavaScript:

```bash
cd /httpdocs/server
npx tsc
```

This creates `/httpdocs/server/dist/index.js` and the rest of the compiled server.

4. Click **Apply** to start the Node.js application
5. Plesk will detect the `package.json` scripts and manage the process

### Alternative: Custom Startup Command

If the automatic detection doesn't work, set:

```
npm run start
```

or directly:

```
node dist/index.js
```

### Verify the Node.js App is Running

```bash
curl http://localhost:3001/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

---

## 11. Configure Plesk SMTP Mail

For password resets and welcome emails:

1. Go to **Websites & Domains** → **Mail** tab
2. **Add Email Address**: `noreply@anelyria.de`
3. Set a strong password
4. Go to **Tools & Settings** → **Mail Server Settings**
5. Ensure SMTP server is enabled on port 587 (submission)
6. Disable any IP restrictions if needed for localhost sending

### Test SMTP

```bash
cd /httpdocs/server
node -e "
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({
  host: 'localhost',
  port: 587,
  auth: { user: 'noreply@anelyria.de', pass: 'your-password' }
});
t.sendMail({
  from: 'noreply@anelyria.de',
  to: 'admin@anelyria.de',
  subject: 'Test',
  text: 'SMTP is working!'
}).then(console.log).catch(console.error);
"
```

---

## 12. Set Up Subdomain (app.anelyria.de)

Both domains serve the same SPA. The app handles routing internally.

### Option A: Same Document Root (Recommended)

In **Hosting Settings** for `app.anelyria.de`:
- **Document root:** `/httpdocs` (same as main domain)
- The Node.js app serves the same `dist/index.html` for both

### Option B: Plesk Domain Aliases

1. Go to **Websites & Domains** → **anelyria.de** → **Hosting Settings**
2. In **Domain aliases**, add `app.anelyria.de`
3. Now both domains resolve to the same document root

### Option C: Separate Subdomain with Proxy

1. Add `app.anelyria.de` as a subdomain
2. In **Hosting Settings**, enable **Proxy mode** and point to `http://localhost:3001`
3. This ensures all requests to `app.anelyria.de` go through the Express app

---

## 13. Enable HTTPS with Let's Encrypt

1. Go to **Websites & Domains** → **anelyria.de**
2. Click **SSL/TLS Certificates**
3. Click **Let's Encrypt**
4. Enter the email address for renewal notifications
5. Include both domains:
   - `anelyria.de`
   - `app.anelyria.de`
6. Click **Install**
7. Enable **Permanently redirect HTTP to HTTPS**

Repeat for `app.anelyria.de` if it's a separate subdomain (not alias).

---

## 14. Create First Tenant

Now visit the LyriaBuilder:

```
https://anelyria.de/lyriabuilder/login
```

1. Log in with the super admin credentials created in Step 9
2. Click **Create New Tenant**
3. Fill in:
   - **Tenant Name:** e.g., "Acme Corp"
   - **Subdomain Slug:** e.g., "acme" (creates `acme.anelyria.de`)
   - **Manager Email:** e.g., "admin@acme.com"
   - **Initial Password:** e.g., "SecurePassword123!"
4. Click **Provision**

What happens behind the scenes:
1. A new MariaDB database `anelyria_acme` is created
2. A dedicated database user is created with full privileges
3. Prisma migrations are run on the new database
4. The tenant record is saved in the master database
5. A `UserRoute` is created mapping the manager email → tenant slug
6. The manager user is created in the tenant database with `admin` role

---

## 15. Verify Everything Works

### 15.1 Landing Page

```
https://anelyria.de/
```

Expected: Beautiful landing page with animated hero section.

### 15.2 LyriaBuilder

```
https://anelyria.de/lyriabuilder/login
```

Expected: Super admin login. After login, the tenant management dashboard.

### 15.3 App Dashboard

```
https://app.anelyria.de/login
```

Expected: Tenant user login page.

### 15.4 Test Tenant Login

Log in with the manager email and password from Step 14:

```
https://app.anelyria.de/app
```

Expected: Full dashboard with stats, CHI tracking, leaderboards, etc.

### 15.5 Health Check

```bash
curl https://anelyria.de/api/health
```

Expected: `{"status":"ok","timestamp":"..."}`

### 15.6 Password Reset

1. Go to `https://app.anelyria.de/login`
2. Click **Forgot password?**
3. Enter the manager email
4. Check email for reset link

---

## 16. Troubleshooting

### 16.1 "Cannot find module" errors

**Problem:** Server fails to start because Prisma client is not generated.

**Solution:**
```bash
cd /httpdocs/server
npx prisma generate --schema=prisma-master/schema.prisma
cd /httpdocs
npx prisma generate
```

### 16.2 "ECONNREFUSED" database connection

**Problem:** Server can't connect to MariaDB.

**Solutions:**
- Verify MariaDB is running: `systemctl status mariadb`
- Check `.env` database URL is correct
- Verify database user has correct permissions
- Check Plesk database host (use `localhost`, not IP)
- Ensure MariaDB is listening on the expected port

### 16.3 App shows white screen / 404

**Problem:** SPA routes aren't loading.

**Solutions:**
- Ensure `dist/` exists with `index.html`
- Check Express static serving path: `path.join(__dirname, '../../dist')`
- Verify the Node.js app is configured with the correct document root
- Try clearing browser cache

### 16.4 "Invalid credentials" during login

**Problem:** Can't log in even with correct credentials.

**Solutions:**
- Check that `UserRoute` exists in master DB: `SELECT * FROM UserRoute WHERE email = 'your-email';`
- Verify tenant is active in master DB: `SELECT * FROM Tenant WHERE slug = 'your-slug';`
- Check user exists in tenant DB
- Ensure password is correctly hashed with bcrypt

### 16.5 SMTP emails not sending

**Problem:** Password reset emails aren't delivered.

**Solutions:**
- Test SMTP manually (see Section 11)
- Check Plesk mail logs: `/var/log/maillog`
- Verify SMTP credentials in `.env`
- Ensure mail server is not blocking local connections
- Check spam folder

### 16.6 Tenant provisioning fails

**Problem:** Creating a new tenant throws an error.

**Solutions:**
- Verify `MASTER_DB_USER` and `MASTER_DB_PASSWORD` have `CREATE DATABASE` privileges
- Check MariaDB error logs: `/var/log/mariadb/mariadb.log`
- Ensure Prisma migrations can run on new databases
- Try creating the database manually first to test permissions

### 16.7 Node.js app keeps restarting

**Problem:** Plesk reports Node.js app crashes repeatedly.

**Solutions:**
- Check application logs in Plesk Node.js panel
- Run the app manually to see errors:
  ```bash
  cd /httpdocs/server && node dist/index.js
  ```
- Common issues: Missing `.env`, wrong database URL, missing Prisma client

### 16.8 Port 3001 already in use

**Problem:** Another Node.js app uses port 3001.

**Solution:** Change `PORT=3002` in `.env` and update the Node.js app configuration in Plesk.

---

## 17. Security Considerations

### 17.1 Production Checklist

- [ ] **Change JWT_SECRET** to a long random string (openssl rand -base64 48)
- [ ] **Change SETUP_KEY** — only needed for initial registration
- [ ] **Use strong passwords** for MariaDB users
- [ ] **Enable HTTPS** via Let's Encrypt (already done in Step 13)
- [ ] **Set CORS_ORIGIN** to your specific domains, not `*`
- [ ] **Rate limiting** is enabled by default
- [ ] **Change all default passwords** (database, email, super admin)
- [ ] **Remove demo accounts** from seed scripts in production
- [ ] **Disable VITE_APP_MODE=dev** — set to `main` for production

### 17.2 Ongoing Security

- **Regular updates:** Keep Node.js, npm packages, and MariaDB updated
- **Database backups:** Use Plesk backup or automated MariaDB dumps
- **Monitor logs:** Check Plesk logs for suspicious activity
- **Audit trail:** Anelyria logs all admin actions in the audit log
- **Session timeout:** JWT tokens expire after 8 hours by default

### 17.3 LyriaBuilder Access

The LyriaBuilder is at `/lyriabuilder` — intentionally not linked anywhere on the public site. Access is controlled by:
1. **URL obscurity** (not discoverable from public pages)
2. **Super admin authentication** (valid credentials required)
3. **JWT validation** on every API request

> ⚠️ **Never** link to `/lyriabuilder` from public pages or documentation.

---

## 18. Maintenance & Backup

### 18.1 Database Backups

Using Plesk Scheduled Tasks:

```bash
#!/bin/bash
# /usr/local/bin/anelyria-backup.sh
BACKUP_DIR="/var/backups/anelyria"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Dump master database
mysqldump -u anelyria_master_user -p'PASSWORD' anelyria_master \
  > $BACKUP_DIR/master_$DATE.sql

# Dump all tenant databases
for DB in $(mysql -u root -e "SHOW DATABASES LIKE 'anelyria_%'" -N); do
  mysqldump -u root $DB > $BACKUP_DIR/${DB}_$DATE.sql
done

# Compress and remove old backups
gzip $BACKUP_DIR/*.sql
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

Add to Plesk: **Tools & Settings** → **Scheduled Tasks** → **Add Task**

### 18.2 Application Updates

```bash
cd /httpdocs
git pull                          # Get latest code
npm ci --omit=dev                 # Install dependencies
npm run build                     # Rebuild frontend
cd server && npm ci --omit=dev    # Server dependencies
npx tsc                           # Rebuild server
npx prisma generate --schema=prisma-master/schema.prisma  # Regenerate master client
cd .. && npx prisma generate      # Regenerate tenant client
npx prisma migrate deploy         # Apply any new migrations
# Restart Node.js app via Plesk UI
```

### 18.3 Monitoring

- Set up **Plesk monitoring** for disk space, memory, and CPU
- Configure **uptime monitoring** (e.g., UptimeRobot, Better Uptime)
- Monitor API health: `https://anelyria.de/api/health`
- Set up email alerts for Node.js app crashes

### 18.4 Scaling

If you need to scale beyond a single Plesk server:

1. **Separate database server:** Move MariaDB to a dedicated server
2. **Horizontal scaling:** Use a load balancer with multiple app instances
3. **Redis caching:** For session management and leaderboard caching
4. **CDN:** Serve static assets from a CDN (Cloudflare, etc.)

---

## Quick Reference

```bash
# ===== Setup Commands (in order) =====

# 1. Dependencies
cd /httpdocs && npm ci --omit=dev
cd server && npm ci --omit=dev

# 2. Copy and edit .env
cd /httpdocs && cp .env.example .env && nano .env

# 3. Build frontend
npm run build

# 4. Generate Prisma clients
cd /httpdocs && npx prisma generate
cd server && npx prisma generate --schema=prisma-master/schema.prisma

# 5. Run master DB migrations
cd /httpdocs/server && npx prisma migrate deploy --schema=prisma-master/schema.prisma

# 6. Build server (TypeScript → JavaScript)
cd /httpdocs/server && npx tsc

# 7. Register first super admin
curl -X POST https://anelyria.de/api/auth/register-first-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@anelyria.de","password":"SecurePass123!","name":"Admin","setupKey":"YOUR_SETUP_KEY"}'

# 8. Configure Node.js app in Plesk (see Section 10)

# ===== Useful URLs =====
# Landing:        https://anelyria.de/
# LyriaBuilder:   https://anelyria.de/lyriabuilder/login
# App Dashboard:  https://app.anelyria.de/app
# API Health:     https://anelyria.de/api/health
```

---

> **Need help?** Contact support at support@anelyria.de or open an issue in the repository.
> **License:** MIT — Free to deploy and modify.
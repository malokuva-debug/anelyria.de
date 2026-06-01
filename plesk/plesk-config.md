# Plesk Deployment Guide for Anelyria

## Prerequisites
- MariaDB 10.6+
- Node.js 20+
- Two domains/subdomains: `anelyria.de` and `app.anelyria.de`

## Database Setup
1. Create a Master Database in Plesk (e.g., `anelyria_master`).
2. Create a database user with full privileges to create other databases (required for tenant provisioning).
3. Update `.env` with `MASTER_DATABASE_URL="mysql://user:pass@localhost:3306/anelyria_master"`.

## Main Branch (anelyria.de)
1. In Plesk, add the domain `anelyria.de`.
2. Go to "Node.js" and enable it.
3. Set the "Document Root" to `/httpdocs/dist`.
4. Set the "Application Startup File" to `server/dist/index.js`.
5. Add Environment Variables:
   - `VITE_APP_MODE=main`
   - `MASTER_DATABASE_URL=...`
   - `JWT_SECRET=...`
6. Use `plesk/deploy-main.sh` to deploy.

## App Branch (app.anelyria.de)
1. In Plesk, add the domain `app.anelyria.de`.
2. Go to "Node.js" and enable it.
3. Set the "Document Root" to `/httpdocs/dist`.
4. Set the "Application Startup File" to `server/dist/index.js`.
5. Add Environment Variables:
   - `VITE_APP_MODE=app`
   - `MASTER_DATABASE_URL=...` (same as main)
   - `JWT_SECRET=...` (same as main)
6. Use `plesk/deploy-app.sh` to deploy.

## Shared Backend
Both deployments point to the same codebase but build different frontend bundles. They share the same `server/` code and the same Master database.
When a new tenant is created via `anelyria.de/builder`, the server will provision a new MariaDB database. Ensure the database user provided in `MASTER_DATABASE_URL` has the `CREATE` privilege.

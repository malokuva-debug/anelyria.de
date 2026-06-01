#!/usr/bin/env bash
# =============================================================================
# Anelyria Platform — Production Setup Script
# Supports: Local dev, Plesk hosting, Docker, any Node.js host
# Database: MariaDB / MySQL
# =============================================================================

set -euo pipefail

# ---------- helpers ----------
info()    { printf "\033[1;36m[INFO]\033[0m  %s\n" "$*"; }
success() { printf "\033[1;32m[OK]\033[0m    %s\n" "$*"; }
warn()    { printf "\033[1;33m[WARN]\033[0m  %s\n" "$*"; }
fail()    { printf "\033[1;31m[FAIL]\033[0m  %s\n" "$*" >&2; exit 1; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

# ---------- preflight ----------
info "Anelyria Platform — Setup"
info "=========================="

command_exists node || fail "Node.js 20+ is required. Install from https://nodejs.org"
command_exists npm  || fail "npm is required."

NODE_VERSION=$(node -v | sed 's/v//;s/\..*//')
if [ "$NODE_VERSION" -lt 20 ]; then
  fail "Node.js 20+ is required. You have $(node -v)."
fi

SKIP_DB=false
[[ "${1:-}" == "--skip-db" ]] && SKIP_DB=true
SEED_DATA=false
[[ "${1:-}" == "--seed" ]] && SEED_DATA=true

# ---------- step 1: dependencies ----------
info "Step 1/6 — Installing dependencies..."
if [ -d "node_modules" ] && [ -f "package-lock.json" ]; then
  npm ci --silent || npm install --silent
else
  npm install --silent
fi
success "Dependencies installed."

# ---------- step 2: environment ----------
info "Step 2/6 — Configuring environment..."
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    # Generate a secure auth secret
    if command_exists openssl; then
      SECRET=$(openssl rand -base64 48)
      sed -i.bak "s|AUTH_SECRET=.*|AUTH_SECRET=\"${SECRET}\"|" .env && rm -f .env.bak
    fi
    success "Created .env from template (edit with your credentials)."
  else
    fail ".env.example not found."
  fi
else
  success ".env already exists — skipping."
fi

# ---------- step 3: database ----------
info "Step 3/6 — Database setup..."
if [ "$SKIP_DB" = true ]; then
  warn "Skipping database setup (--skip-db). Running in frontend-only demo mode."
else
  if ! command_exists mysql && ! command_exists mariadb; then
    warn "mysql/mariadb client not found."
    info "Suggested: Use Plesk panel to create database, or run 'docker compose up -d postgres'"
    info "Then set DATABASE_URL in .env and run:"
    info "  npx prisma generate"
    info "  npx prisma migrate deploy"
  else
    info "Generating Prisma client..."
    npx prisma generate --silent
    info "Running migrations..."
    npx prisma migrate deploy --silent && success "Migrations applied." || {
      warn "Migrations failed. Is DATABASE_URL correct in .env?"
      info "Try: npx prisma db push --accept-data-loss"
    }
    if [ "$SEED_DATA" = true ]; then
      info "Seeding database..."
      npx prisma db seed --silent && success "Database seeded." || warn "Seed failed (non-fatal)."
    fi
  fi
fi

# ---------- step 4: build ----------
info "Step 4/6 — Building production bundle..."
npm run build --silent && success "Build successful." || fail "Build failed."

# ---------- step 5: lint ----------
info "Step 5/6 — Code quality check..."
if npm run lint --silent 2>/dev/null; then
  success "Lint passed."
else
  warn "Lint issues detected (non-fatal). Run 'npm run lint' for details."
fi

# ---------- step 6: ready ----------
info "Step 6/6 — Setup complete!"
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║   🟣  Anelyria Platform — Ready!                                 ║"
echo "║                                                                  ║"
echo "║   Demo accounts (development seed):                              ║"
echo "║     Employee :  john.doe@anelyria.com / password123             ║"
echo "║     Team Lead:  sarah.johnson@anelyria.com / password123        ║"
echo "║     Manager  :  alex.martinez@anelyria.com / password123        ║"
echo "║     Admin    :  priya.patel@anelyria.com / password123          ║"
echo "║                                                                  ║"
echo "║   Commands:                                                      ║"
echo "║     npm run dev        — development server                      ║"
echo "║     npm run build      — production build                        ║"
echo "║     npm run start      — production server                       ║"
echo "║     npm run db:studio  — open Prisma Studio                      ║"
echo "║                                                                  ║"
echo "║   Production Deployment (Plesk):                                 ║"
echo "║     1. Create MariaDB database in Plesk                          ║"
echo "║     2. Set DATABASE_URL in .env                                  ║"
echo "║     3. npx prisma migrate deploy                                 ║"
echo "║     4. npm run build                                             ║"
echo "║     5. Configure Node.js app in Plesk pointing to dist/          ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
info "Run 'npm run dev' to start development, or 'npm run start' for production."

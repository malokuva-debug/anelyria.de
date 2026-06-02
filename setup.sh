#!/usr/bin/env bash
# =============================================================================
# Anelyria Platform — Production Setup Script
# Supports: Local dev, Plesk hosting, Docker, any Node.js host
# Database: MariaDB / MySQL
# 
# Usage: bash setup.sh [--skip-db] [--seed]
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
SEED_DATA=false
for arg in "$@"; do
  case "$arg" in
    --skip-db) SKIP_DB=true ;;
    --seed) SEED_DATA=true ;;
  esac
done

# ---------- step 1: dependencies ----------
info "Step 1/6 — Installing dependencies (this also installs server deps and generates Prisma clients)..."
if [ -d "node_modules" ] && [ -f "package-lock.json" ]; then
  npm ci --silent || npm install --silent
else
  npm install --silent
fi
success "Dependencies installed. Prisma clients generated."

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
            info "  cd server && npm run db:generate"
            info "  cd server && npm run db:push:master"
  else
    info "Running master database setup..."
          (cd server && npm run db:push:master) && success "Database tables created." || {
      warn "Migrations failed. Is MASTER_DATABASE_URL correct in .env?"
    }
    if [ "$SEED_DATA" = true ]; then
      info "Seeding database..."
      (cd server && npx tsx ../prisma/seed.ts) && success "Database seeded." || warn "Seed failed (non-fatal)."
    fi
  fi
fi

# ---------- step 4: build ----------
info "Step 4/6 — Building production bundle (frontend + server)..."
npm run build --silent && success "Build successful." || fail "Build failed."

# ---------- step 5: ready ----------
info "Step 5/5 — Setup complete!"
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║   🟣  Anelyria Platform — Ready!                                 ║"
echo "║                                                                  ║"
echo "║   Commands:                                                      ║"
echo "║     npm run dev        — development server (Vite)               ║"
echo "║     npm run build      — production build (frontend + server)    ║"
echo "║     npm run start      — production server (Express)             ║"
echo "║                                                                  ║"
echo "║   Production Deployment (Plesk):                                 ║"
echo "║     1. Create MariaDB database in Plesk                          ║"
echo "║     2. Set MASTER_DATABASE_URL in .env                           ║"
echo "║     3. npm install       (also installs server deps)             ║"
echo "║     4. npm run build     (frontend + server in one step)         ║"
echo "║     5. cd server && npm run db:push:master                       ║"
echo "║     6. cd server && npm run db:seed:master                       ║"
echo "║     7. Configure Node.js app in Plesk pointing to server/        ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
info "Run 'npm run dev' to start development, or 'npm run start' for production."
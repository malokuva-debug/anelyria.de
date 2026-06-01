# =============================================================================
# Octopus Energy CHI Platform — Docker Setup
# =============================================================================

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html 2>/dev/null || true
COPY prisma ./prisma
RUN npx prisma generate

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --spider -q http://localhost:3000/ || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && npx serve dist -s -l 3000"]

# =============================================================================
# Development (use with docker-compose)
# =============================================================================

FROM node:20-alpine AS development
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# 🟣 Anelyria — Performance, Perfected

**Production-ready, multi-tenant employee performance platform.** Track CHI, INK, and Calls-per-hour. Reward top performers. Scale across organizations.

![iOS 26 Liquid Glass Design](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop)

## ✨ Features

### Core Metrics
- **CHI (Customer Happiness Index)** — Positive / Neutral / Negative tracking
- **INK (Individual Knowledge)** — 0-100 quality scores
- **Calls Per Hour** — Productivity metric
- **Unified CSV Import** — Single upload for all three metrics

### Gamification & Rewards
- **Coins** — Custom-named virtual currency (configurable per tenant)
- **Reward Shop** — Gift cards, merch, time off, experiences
- **Achievements** — Unlockable badges with coin rewards
- **Leaderboards** — Weekly, monthly, all-time, team
- **Streaks** — Daily activity tracking

### Multi-Tenant Architecture
- **Custom Branding** — Logo, name, primary color
- **Custom Metric Names** — Rename CHI/INK/Calls/Coins per tenant
- **Configurable Bonus Thresholds** — Per-tenant Level 1/2/3 targets
- **Flexible Billing Intervals** — 1-31, 26-25, or any custom range
- **Full Data Isolation** — Tenant ID scoped at every query

### Role-Based Access Control
| Role        | Dashboard | Metrics | Import | Team Mgmt | User Mgmt | Admin |
|-------------|-----------|---------|--------|-----------|-----------|-------|
| **Employee**    | ✓         | ✓       | ✗      | ✗         | ✗         | ✗     |
| **Team Lead**   | ✓         | ✓       | ✓      | ✓         | ✗         | ✗     |
| **Manager**     | ✓         | ✓       | ✓      | ✓         | ✓         | ✓     |
| **Admin**       | ✓         | ✓       | ✓      | ✓         | ✓         | ✓     |

### Security
- BCrypt password hashing (12 rounds)
- Secure session management
- Password reset via email
- Full audit trail (every action logged)
- CSRF protection
- Rate limiting
- MariaDB with encrypted connections
- Multi-tenant data isolation

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` — click **Sign In** to see demo accounts.

### Demo Accounts (Development Seeding)

| Role      | Email                          | Password     |
|-----------|--------------------------------|--------------|
| Employee  | john.doe@anelyria.com          | password123  |
| Team Lead | sarah.johnson@anelyria.com     | password123  |
| Manager   | alex.martinez@anelyria.com     | password123  |
| Admin     | priya.patel@anelyria.com       | password123  |

### Production Deployment (Plesk / MariaDB)

**1. Database Setup (Plesk Panel)**
1. Log into Plesk
2. Go to **Databases** → **Add Database**
3. Create database: `anelyria_production`
4. Create user: `anelyria_user` with strong password
5. Grant ALL PRIVILEGES on the database

**2. Clone & Configure**
```bash
git clone <your-repo> anelyria
cd anelyria
cp .env.example .env
```

**3. Edit `.env`**
```bash
DATABASE_URL="mysql://anelyria_user:YOUR_STRONG_PASSWORD@localhost:3306/anelyria_production"
AUTH_SECRET="$(openssl rand -base64 48)"
AUTH_URL="https://your-domain.com"
SMTP_HOST=smtp.your-domain.com
SMTP_USER=noreply@your-domain.com
SMTP_PASS=your_smtp_password
```

**4. Install & Build**
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed    # Optional: seed initial data
npm run build
```

**5. Serve**
```bash
# Option A: Node server
npm run start

# Option B: Docker
docker compose up -d

# Option C: Plesk Node.js app
# Upload dist/ folder, configure Node.js app in Plesk
```

## 📊 CSV Import Format

Import all three metrics in one file:

```csv
employee_id,email,date,chi,ink,calls_per_hour,notes
AN-2847,john.doe@anelyria.com,2025-01-15,positive,78,32,Great customer feedback
AN-1023,sarah.johnson@anelyria.com,2025-01-15,neutral,82,28,Average quality
AN-1456,michael.chen@anelyria.com,2025-01-15,negative,45,18,Missed follow-up
```

**CHI values:** `positive`, `neutral`, `negative`
**INK values:** `0-100`
**Calls values:** `0+` (float)

## 🧮 CHI Score Formula

```
CHI Score = (Positive CHIs - Negative CHIs) / Total CHIs

Where:
  Total CHIs = Positive + Neutral + Negative
```

**Note:** Neutral CHIs count toward total (they dilute the score).

### Bonus Levels (configurable)

| Level | Threshold | Reward (default) |
|-------|-----------|------------------|
| 1     | ≥ 0.80    | 100 Coins        |
| 2     | ≥ 0.85    | 150 Coins        |
| 3     | ≥ 0.90    | 250 Coins        |

## 📁 Project Structure

```
anelyria/
├── prisma/
│   └── schema.prisma          # MariaDB schema (multi-tenant)
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Top nav + logout
│   │   ├── Sidebar.tsx        # Role-filtered navigation
│   │   └── icons.tsx          # SVG icon library
│   ├── data/
│   │   └── mockData.ts        # Seed data (dev only)
│   ├── pages/
│   │   ├── Landing.tsx        # Marketing page
│   │   ├── LoginModal.tsx     # Auth + password reset
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   └── Pages.tsx          # All feature pages
│   ├── store/
│   │   └── useStore.ts        # Zustand state + RBAC
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── App.tsx                # Auth routing
│   ├── main.tsx               # Entry
│   └── index.css              # Liquid Glass design system
├── .env.example               # Env template
├── docker-compose.yml         # Production Docker
├── Dockerfile                 # Multi-stage build
├── setup.sh                   # One-command setup
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + iOS 26 Liquid Glass
- **State:** Zustand
- **Charts:** Recharts
- **Database:** MariaDB (via Prisma)
- **ORM:** Prisma 5
- **Icons:** Lucide + Custom SVG
- **Auth:** Backend API (Auth.js compatible)

## 🔐 Password Reset Flow

1. User clicks "Forgot password?" on login modal
2. Enters email address
3. Backend generates secure token, stores in `PasswordResetToken` table
4. Email dispatched via SMTP/Resend with reset link
5. User clicks link → sets new password (BCrypt hashed)
6. Token marked as used, expires after 1 hour

## 📦 API Endpoints (Production Backend)

| Method | Endpoint                          | Auth         | Purpose |
|--------|-----------------------------------|--------------|---------|
| POST   | `/api/auth/login`                 | Public       | Authenticate user |
| POST   | `/api/auth/logout`                | Session      | End session |
| POST   | `/api/auth/forgot-password`       | Public       | Request reset link |
| POST   | `/api/auth/reset-password`        | Token        | Set new password |
| GET    | `/api/users`                      | Manager+     | List users |
| POST   | `/api/users`                      | Manager+     | Create user |
| PATCH  | `/api/users/:id`                  | Manager+     | Update user |
| DELETE | `/api/users/:id`                  | Admin        | Remove user |
| POST   | `/api/metrics/import`             | Team Lead+   | CSV import |
| GET    | `/api/metrics/:userId`            | Authenticated| Get metrics |
| GET    | `/api/dashboard/stats`            | Authenticated| Dashboard data |
| GET    | `/api/leaderboard`                | Authenticated| Rankings |
| POST   | `/api/rewards/redeem`             | Authenticated| Redeem reward |
| GET    | `/api/tenants/:id/settings`       | Manager+     | Tenant settings |
| PATCH  | `/api/tenants/:id/settings`       | Manager+     | Update settings |
| GET    | `/api/audit-logs`                 | Manager+     | Audit trail |

## 🐳 Docker

```bash
# Production
docker compose up -d

# Development
docker compose -f docker-compose.yml up dev
```

## 📝 License

Commercial. Contact sales@anelyria.com for licensing.

---

**Anelyria — Built for teams that take performance seriously.**

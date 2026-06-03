# Anelyria Platform — Plesk-Deployment-Anleitung (Deutsch)

> **Deployment der Multi-Tenant Performance-Plattform als Node.js-App auf Plesk Shared Hosting.**
> **Zwei Domains:** `anelyria.de` (statische Landingpage) + `app.anelyria.de` (React SPA + Express API)

---

## Inhaltsverzeichnis

1. [Überblick](#1-überblick)
2. [Voraussetzungen](#2-voraussetzungen)
3. [Domain-Setup](#3-domain-setup)
4. [MariaDB-Datenbank erstellen](#4-mariadb-datenbank-erstellen)
5. [Dateien hochladen](#5-dateien-hochladen)
6. [Umgebungsvariablen konfigurieren](#6-umgebungsvariablen-konfigurieren)
7. [Abhängigkeiten installieren](#7-abhängigkeiten-installieren)
8. [Master-Datenbank-Schema pushen](#8-master-datenbank-schema-pushen)
9. [Super-Admin seeden](#9-super-admin-seeden)
10. [Node.js-App in Plesk konfigurieren](#10-nodejs-app-in-plesk-konfigurieren)
11. [Statische Landingpage konfigurieren](#11-statische-landingpage-konfigurieren)
12. [HTTPS mit Let's Encrypt aktivieren](#12-https-mit-lets-encrypt-aktivieren)
13. [Ersten Tenant erstellen](#13-ersten-tenant-erstellen)
14. [Alles verifizieren](#14-alles-verifizieren)
15. [Fehlerbehebung (Troubleshooting)](#15-fehlerbehebung-troubleshooting)
16. [Sicherheitshinweise](#16-sicherheitshinweise)
17. [Wartung & Backup](#17-wartung--backup)

---

## 1. Überblick

Die Anelyria-Plattform besteht aus zwei Teilen, die auf demselben Plesk-Server betrieben werden:

| Domain | Inhalt | Technologie |
|--------|--------|-------------|
| `anelyria.de` | Statische Marketing-Landingpage | Reines HTML + CSS (kein Build-Tool) |
| `app.anelyria.de` | React SPA (Login + Dashboard) + Express API | Node.js Applikation |

**Architektur-Prinzipien:**
- **Alles vorgebaut** — Frontend (Vite), Server (TypeScript) und Prisma-Clients werden vor dem Upload in der Sandbox compiliert
- **Keine Build-Tools auf Plesk** — kein `vite`, `tsc` oder `prisma generate` nötig
- **Getrennte Domains** — `anelyria.de` zeigt auf `landing/` Ordner, `app.anelyria.de` auf die Node.js-App
- **Plesk Node 25 kompatibel** — seed-script liegt als `.js` vor (kein `tsx` nötig)

---

## 2. Voraussetzungen

**Plesk Server:**
- Plesk Obsidian (18.x oder neuer) mit installierter **Node.js Toolkit**-Erweiterung
- MariaDB 10.6+ (oder MySQL 8.0+) — in Plesk enthalten
- Node.js 20.x oder 22.x/25.x (über Plesk Node.js Toolkit installierbar)
- SMTP-Mail-Dienst (Plesk Mail oder extern)

---

## 3. Domain-Setup

Zwei Domains/Subdomains einrichten, die auf denselben Server zeigen:

| Domain | Zweck | DNS-Eintrag |
|--------|-------|-------------|
| `anelyria.de` | Landingpage (statisch) | `A`-Record → Server-IP |
| `app.anelyria.de` | React SPA + API | `CNAME` → `anelyria.de` (oder `A` → gleiche IP) |

### In Plesk:

1. **Websites & Domains** → **Domain hinzufügen**
2. `anelyria.de` als primäre Domain hinzufügen
3. **Websites & Domains** → **anelyria.de** → **Subdomain hinzufügen**
4. `app` als Subdomain hinzufügen (ergibt `app.anelyria.de`)
5. Für jede Domain später das Document Root separat konfigurieren (siehe Schritte 10-11)

---

## 4. MariaDB-Datenbank erstellen

### 4.1 Master-Datenbank (`anelyria_master`)

Diese Datenbank speichert Routing-Informationen (E-Mail → Tenant-Zuordnung), Super-Admin-Konten und Tenant-Verbindungsdaten.

**Schritte:**
1. **Plesk** → **Datenbanken** → **Datenbank hinzufügen**
2. Datenbank `anelyria_master` erstellen:
   - **Datenbank-Name:** `anelyria_master`
   - **Datenbank-Benutzer:** `anelyria_master_user`
   - **Sicheres Passwort generieren** und sicher speichern
3. Separaten DB-Admin-Benutzer für Tenant-Provisionsierung erstellen:
   - **Datenbank-Benutzer:** `anelyria_admin`
   - **Berechtigungen:** `CREATE`, `DROP`, `ALTER`, `INDEX`, `SELECT`, `INSERT`, `UPDATE`, `DELETE` auf `anelyria_%` (oder `*.*`)

### 4.2 Tenant-Datenbanken

Tenant-Datenbanken werden automatisch über den Super-Admin-Bereich (LyriaBuilder) erstellt. Es ist keine manuelle Erstellung nötig.

---

## 5. Dateien hochladen

### Option A: Plesk Git (empfohlen)

1. **Websites & Domains** → **anelyria.de** → **Git**
2. Repository-URL hinzufügen (z.B. `https://github.com/your-org/anelyria-platform.git`)
3. Branch auswählen (z.B. `main`) → **Fetch & Pull**
4. Dateien liegen in `/httpdocs`

### Option B: Plesk File Manager / SFTP

1. **Websites & Domains** → **anelyria.de** → **Dateimanager**
2. Projektordner hochladen (gesamtes Projekt via SFTP oder ZIP-Upload)
3. Bei ZIP: Im Dateimanager entpacken

### Empfohlene Ordnerstruktur nach Upload:

```
/httpdocs/
├── package.json           # Runtime-Dependencies (Express, Prisma, etc.)
├── .env                   # Umgebungsvariablen
├── landing/
│   └── index.html         # 🎯 Document Root für anelyria.de (statisch)
├── server/
│   ├── public/            # 🎯 Document Root für app.anelyria.de (vorgebautes SPA)
│   │   ├── index.html
│   │   └── assets/
│   ├── dist/              # Compilierter Express-Server
│   │   └── index.js
│   ├── generated/         # Prisma Clients (vorgeneriert)
│   │   ├── master-client/
│   │   └── tenant-client/
│   ├── prisma-master/
│   │   └── schema.prisma
│   ├── prisma/
│   │   ├── seed-master.ts
│   │   └── seed-master.js # 🎯 Compiliertes Seed-Script (Node 25 kompatibel)
│   └── package.json       # Minimale Server-Dependencies
├── prisma/
│   └── schema.prisma      # Tenant-Prisma-Schema
└── node_modules/          # Nach npm install
```

---

## 6. Umgebungsvariablen konfigurieren

`.env.example` in `.env` kopieren und mit den Plesk-Werten befüllen:

```bash
# Per Dateimanager: .env.example → .env kopieren und bearbeiten
# Oder per Plesk Node.js-UI: Umgebungsvariablen einzeln eintragen
```

**Wichtige Variablen:**

| Variable | Beschreibung | Beispiel |
|----------|-------------|----------|
| `NODE_ENV` | Betriebsmodus | `production` |
| `PORT` | Port der Express-App | `3001` |
| `MASTER_DATABASE_URL` | Master-DB-Verbindung | `mysql://anelyria_master_user:PASS@localhost:3306/anelyria_master` |
| `MASTER_DB_USER` | DB-Admin (für Tenant-Erstellung) | `anelyria_admin` |
| `MASTER_DB_PASSWORD` | DB-Admin-Passwort | (Ihr Passwort) |
| `JWT_SECRET` | JWT-Signatur (64+ Zeichen) | `openssl rand -base64 48` |
| `SETUP_KEY` | Setup-Schlüssel für Admin-Registrierung | (Zufallsstring) |
| `SUPER_ADMIN_EMAIL` | Super-Admin-E-Mail (für Seed) | `admin@anelyria.de` |
| `SUPER_ADMIN_PASSWORD` | Super-Admin-Passwort (für Seed) | (Sicheres Passwort) |
| `CORS_ORIGIN` | Erlaubte Domains | `https://anelyria.de,https://app.anelyria.de` |
| `PRISMA_CLIENT_ENGINE_TYPE` | Prisma-Engine (WASM für Kompatibilität) | `wasm` |

**Alternative:** Alle Variablen direkt im Plesk Node.js-Panel eintragen (Schritt 10).

---

## 7. Abhängigkeiten installieren

> **Wichtig:** Keine Build-Tools nötig! Alles ist vorgebaut. `--ignore-scripts` verhindert, dass Postinstall-Skripts (wie `prisma generate`) laufen.

```bash
cd /httpdocs
npm install --ignore-scripts
```

Oder im Plesk Node.js-Panel:
1. **Node.js** → **npm install** klicken
2. Haken bei **Ignore scripts** setzen (sofern verfügbar)

Dies installiert nur die Runtime-Dependencies:
- `express`, `cors`, `helmet`, `bcryptjs`, `jsonwebtoken`, `mysql2`, `nodemailer`, `@prisma/client`, etc.

---

## 8. Master-Datenbank-Schema pushen

Die Tabellen in `anelyria_master` erstellen:

```bash
cd /httpdocs
npx prisma db push --schema=server/prisma-master/schema.prisma
```

**Im Plesk Node.js-Panel:**
1. **Run Script** → folgenden Befehl eingeben:
   ```
   npx prisma db push --schema=server/prisma-master/schema.prisma
   ```
2. **Ausführen**

Dies erstellt die Tabellen `UserRoute`, `SuperAdmin` und `Tenant` in der Master-Datenbank.

---

## 9. Super-Admin seeden

Ersten Super-Admin-Benutzer anlegen (einmalig):

```bash
cd /httpdocs
node server/prisma/seed-master.js
```

**Im Plesk Node.js-Panel:**
1. **Run Script** → `node server/prisma/seed-master.js`
2. **Ausführen**

Das Script verwendet die Umgebungsvariablen `SUPER_ADMIN_EMAIL` und `SUPER_ADMIN_PASSWORD` (siehe `.env`).
Standardwerte (falls nicht gesetzt):
- **E-Mail:** `valmir.malooku@icloud.com`
- **Passwort:** `Lenoxvm123.`

> **Hinweis:** Das Script überspringt die Erstellung, falls bereits ein Super-Admin existiert.

---

## 10. Node.js-App in Plesk konfigurieren

### Für `app.anelyria.de` (die Subdomain)

1. **Websites & Domains** → **app.anelyria.de** → **Node.js**
2. **Node.js aktivieren**

| Einstellung | Wert |
|-------------|------|
| **Application root** | `/httpdocs` |
| **Application startup file** | `server/dist/index.js` |
| **Application mode** | `production` (oder `development` für Test) |
| **Document root** | `/httpdocs/server/public` |
| **Environment variables** | Aus `.env`-Datei übernehmen oder einzeln eintragen |

3. **Apply** klicken → Node.js-App startet

### Warum Application root = `/httpdocs`?

Der Express-Server greift von `server/dist/index.js` aus auf folgende Pfade zu:
- `../public/` → statische SPA-Dateien
- `.env` → Umgebungsvariablen (von Prisma benötigt)
- `../prisma-master/` → Master-Schema
- `../generated/` → Prisma-Clients

Wenn der Application root auf `server/` gesetzt würde, wären diese relativen Pfade falsch.

---

## 11. Statische Landingpage konfigurieren

### Für `anelyria.de` (die Hauptdomain)

1. **Websites & Domains** → **anelyria.de** → **Hosting-Einstellungen**
2. **Document root** ändern auf: `/httpdocs/landing`
3. **Speichern**

> **Wichtig:** Für `anelyria.de` wird **kein** Node.js aktiviert! Es werden nur statische HTML-Dateien aus `/httpdocs/landing/` ausgeliefert.
>
> Der nginx-Webserver von Plesk serviert die `index.html` direkt, was maximale Performance und minimale Latenz bedeutet.

Die Landingpage ist eine vollständige, eigenständige HTML-Datei mit:
- Dark-Theme + Liquid-Glass-Design (iOS 26)
- Ambilight-Blobs + Noise-Overlay
- Hero-Section, Feature-Grid, Pricing, FAQ
- **"Sign In"-Button** → verlinkt auf `https://app.anelyria.de/login`
- Keine Abhängigkeiten, kein Build-Tool, kein JavaScript-Framework

---

## 12. HTTPS mit Let's Encrypt aktivieren

1. **Websites & Domains** → **anelyria.de** → **SSL/TLS-Zertifikate**
2. **Let's Encrypt** klicken
3. E-Mail-Adresse für Benachrichtigungen eingeben
4. `anelyria.de`, `www.anelyria.de` auswählen
5. **Installieren**

Wiederholen für `app.anelyria.de`:
1. **Websites & Domains** → **app.anelyria.de** → **SSL/TLS-Zertifikate**
2. **Let's Encrypt** → Domain auswählen → **Installieren**

> **Wichtig:** HTTPS ist für Production Pflicht. JWT-Tokens und Passwörter werden unverschlüsselt übertragen.

---

## 13. Ersten Tenant erstellen

1. `https://app.anelyria.de/lyriabuilder/login` öffnen
2. Mit Super-Admin-Zugangsdaten anmelden (aus Schritt 9)
3. **Create New Tenant** klicken
4. Ausfüllen:
   - **Organization Name:** z.B. "Acme Corp"
   - **Slug:** z.B. "acme" (für Subdomain und DB-Name)
   - **Manager Email:** E-Mail des ersten Tenant-Admins
   - **Manager Password:** Initial-Passwort
5. **Provision** klicken — das System:
   - Erstellt eine neue MariaDB-Datenbank (`anelyria_acme`)
   - Führt Prisma-Migrationen aus
   - Erstellt den Admin-Benutzer mit Manager-Rolle
   - Registriert den Routingeintrag in der Master-DB
6. Der Tenant-Admin kann sich jetzt unter `https://app.anelyria.de/login` anmelden

---

## 14. Alles verifizieren

### ✅ API-Health-Check
```bash
curl https://app.anelyria.de/api/health
# → {"status":"ok","timestamp":"2025-01-01T00:00:00.000Z"}
```

Oder im Browser öffnen: `https://app.anelyria.de/api/health`

### ✅ Statische Landingpage
`https://anelyria.de` → Anelyria-Landingpage mit "Sign In"-Button

### ✅ LyriaBuilder (Super Admin)
`https://app.anelyria.de/lyriabuilder/login` → Mit Super-Admin anmelden

### ✅ Tenant-Login
`https://app.anelyria.de/login` → Mit Tenant-Benutzer anmelden

### ✅ SPA-Routing
Nach Login: `https://app.anelyria.de/app/dashboard` → Dashboard wird angezeigt
Nach Refresh (F5): Dashboard bleibt erhalten (kein 404)

---

## 15. Fehlerbehebung (Troubleshooting)

### 15.1 "Cannot find module" Fehler

**Problem:** Server startet nicht, weil Prisma-Client fehlt.

**Lösung:** Prüfen, ob `server/generated/master-client/` und `server/generated/tenant-client/` existieren.
Falls nicht, lokal generieren und erneut hochladen:
```bash
cd /httpdocs
npx prisma generate --schema=server/prisma-master/schema.prisma
npx prisma generate --schema=prisma/schema.prisma
```

### 15.2 Server startet nicht (Node.js-Fehler)

**Problem:** Node.js-App startet nicht.

**Lösungen:**
- Node.js-Log prüfen: **Websites & Domains** → **app.anelyria.de** → **Node.js** → **Logs**
- `MASTER_DATABASE_URL` in `.env` prüfen (Korrekte Zugangsdaten?)
- Prüfen, ob `server/dist/index.js` existiert
- Application root korrekt? → `/httpdocs` (nicht `server/`)

### 15.3 Weißer Bildschirm oder 404 bei Seitenaktualisierung

**Problem:** SPA-Routen laden nicht bei F5/Refresh.

**Lösung:**
- Document root für `app.anelyria.de` auf `/httpdocs/server/public` prüfen
- Express-Server hat `app.get('*')` Catch-All, der `index.html` ausliefert
- Prüfen, ob `server/public/index.html` existiert

### 15.4 Datenbank-Zugriffsfehler bei Tenant-Erstellung

**Problem:** Tenant-Provisionsierung schlägt fehl.

**Lösung:**
- `MASTER_DB_USER` und `MASTER_DB_PASSWORD` prüfen (muss CREATE-Berechtigung haben)
- `TENANT_DB_HOST` prüfen (bei Plesk meist `localhost`)
- MariaDB-Logs prüfen: **Tools & Settings** → **Database Server** → **Logs**

### 15.5 Prisma-Engine-Kompatibilität (AlmaLinux/RHEL)

**Problem:** Prisma-Engine `.so`-Bibliothek lädt nicht auf Plesk (AlmaLinux).

**Lösung:**
`PRISMA_CLIENT_ENGINE_TYPE=wasm` in `.env` setzen. Die WASM-Engine ist plattformunabhängig und funktioniert auf jedem Betriebssystem.

### 15.6 Node.js-Version

**Problem:** Node.js 25+ Kompatibilität.

**Lösung:**
- Dieses Projekt ist für Node.js 25 vorbereitet (seed-script als `.js` compiliert)
- Prisma 6.5.x unterstützt Node.js 25
- Bei Node.js 20.x oder 22.x: Keine Anpassungen nötig

---

## 16. Sicherheitshinweise

- **HTTPS-only** — Immer Let's Encrypt für beide Domains aktivieren
- **JWT Secret** — Starken Zufallsstring verwenden (64+ Zeichen, `openssl rand -base64 48`)
- **Setup Key** — `SETUP_KEY` in `.env` ändern und geheim halten
- **Rate Limiting** — Standardmäßig aktiv (100 Requests/Minute, 20 Login-Versuche/15 Min.)
- **Helmet** — Sicherheits-Headers werden automatisch gesetzt
- **BCrypt** — Alle Passwörter mit BCrypt (10 Runden) gehasht
- **Super-Admin-Passwort** — Nach dem ersten Login ändern

---

## 17. Wartung & Backup

### Plattform aktualisieren

```bash
# Über Plesk Git:
cd /httpdocs
git pull origin main

# Abhängigkeiten aktualisieren (kein Build nötig, alles vorgebaut)
npm install --ignore-scripts

# Datenbank-Migrationen (falls vorhanden):
npx prisma migrate deploy --schema=server/prisma-master/schema.prisma

# Node.js-App neustarten:
# → Plesk Node.js-Panel → Restart
```

### Datenbank-Backups

1. **Websites & Domains** → **app.anelyria.de** → **Datenbanken**
2. `anelyria_master` auswählen → **Backup**
3. Tenant-Datenbanken einzeln sichern

### Logs

- **Node.js-Log:** Websites & Domains → app.anelyria.de → Node.js → Logs
- **Application-Logs:** Im Node.js-Panel sichtbar
- **Access-Logs:** Standard-Plesk-Zugriffslogs

---

## Quick-Start-Checkliste

- [ ] Domain `anelyria.de` in Plesk angelegt
- [ ] Subdomain `app.anelyria.de` angelegt
- [ ] MariaDB `anelyria_master` erstellt
- [ ] Datenbank-Benutzer `anelyria_admin` mit CREATE-Berechtigung
- [ ] Dateien hochgeladen (Git oder SFTP)
- [ ] `.env` konfiguriert (aus `.env.example`)
- [ ] `npm install --ignore-scripts` ausgeführt
- [ ] `npx prisma db push --schema=server/prisma-master/schema.prisma` ausgeführt
- [ ] `node server/prisma/seed-master.js` ausgeführt
- [ ] **anelyria.de** → Document Root: `/httpdocs/landing` (KEIN Node.js)
- [ ] **app.anelyria.de** → Node.js aktiviert (Root: `/httpdocs`, Startup: `server/dist/index.js`)
- [ ] **app.anelyria.de** → Document Root: `/httpdocs/server/public`
- [ ] HTTPS via Let's Encrypt aktiviert (beide Domains)
- [ ] Login unter `https://app.anelyria.de/lyriabuilder/login` testen
- [ ] Ersten Tenant erstellen
- [ ] Tenant-Login unter `https://app.anelyria.de/login` testen
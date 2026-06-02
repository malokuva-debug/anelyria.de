#!/bin/bash
# deploy.sh — Single deployment script for Plesk (single Node.js app)
# Both anelyria.de and app.anelyria.de are served from the same build.

echo "Deploying Anelyria Platform..."

# Ensure we are on the main branch
git checkout main
git pull origin main

# Install all dependencies (root + server)
npm install

# Build everything (Vite frontend -> server/public, then TypeScript -> server/dist)
npm run build

# Run master database setup
cd server
npm run db:push:master
cd ..

# Restart the Node.js application
mkdir -p tmp
touch tmp/restart.txt

echo "Deployment completed."
echo ""
echo "Next steps:"
echo "  - If first deployment, run: cd server && npm run db:seed:master"
echo "  - Visit https://anelyria.de/lyriabuilder/login to log in"
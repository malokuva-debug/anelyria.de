#!/bin/bash
# deploy-main.sh

echo "Deploying main branch (anelyria.de)..."

# Ensure we are on the main branch
git checkout main
git pull origin main

# Install dependencies
npm install
cd server && npm install
cd ..

# Build the frontend for main
npm run build:main

# Run master migrations
cd server
npm run db:migrate:master
cd ..

# Restart the Node.js application (Plesk specific or pm2)
# If using pm2:
# pm2 restart anelyria-main
# If using Plesk Node.js extension, it usually restarts when tmp/restart.txt is touched
mkdir -p tmp
touch tmp/restart.txt

echo "Deployment of main branch completed."

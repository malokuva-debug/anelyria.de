#!/bin/bash
# deploy-app.sh

echo "Deploying app branch (app.anelyria.de)..."

# Ensure we are on the app branch
git checkout app
git pull origin app

# Install dependencies
npm install
cd server && npm install
cd ..

# Build the frontend for app
npm run build:app

# Restart the Node.js application
mkdir -p tmp
touch tmp/restart.txt

echo "Deployment of app branch completed."

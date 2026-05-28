# AlumiNet v2 — Setup Guide

## Step 1: Install dependencies
```
cd server && npm install
cd ../client && npm install
```

## Step 2: Create server/.env
Copy server/.env.example to server/.env and fill in:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.nuwuup5.mongodb.net/aluminet?retryWrites=true&w=majority
JWT_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>

# Get FREE Anthropic API key at https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-KEY-HERE

# Leave these as-is for now:
CLOUDINARY_CLOUD_NAME=skip
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=skipskipskipskipskipskipskip
EMAIL_USER=<your_email_user>
EMAIL_PASS=<your_email_password>
EMAIL_FROM=AlumiNet <noreply@aluminet.com>

## Step 3: Seed demo data
```
cd server && node seed.js
```

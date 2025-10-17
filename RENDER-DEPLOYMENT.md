# Live Poll App - Render Deployment Guide

## 🚀 Deploy to Render (Single Service)

This guide shows how to deploy both frontend and backend on a single Render web service.

### Step 1: Prepare Your Code

1. Make sure all your code is pushed to a Git repository (GitHub, GitLab, etc.)

### Step 2: Create a Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository
4. Configure the service:

**Basic Settings:**
- **Name**: `live-poll-app` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave blank
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```

**Environment Variables:**
Add these in the "Environment" section:
- `NODE_ENV` = `production`
- `MONGODB_URI` = `mongodb+srv://emithru:emit_cmrit_2025@fsdproject.hojgqql.mongodb.net/Live-poll`
- `PORT` = `8000` (Render will override this automatically)

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes)
3. Your app will be live at: `https://your-app-name.onrender.com`

### How It Works

**In Production:**
- Server runs on Render's assigned port
- API routes: `https://your-app.onrender.com/api/*`
- Frontend: `https://your-app.onrender.com/` (serves static files from `dist/`)
- Everything runs in one Node.js process

**In Development:**
- Frontend: `localhost:3000` (Vite dev server)
- Backend: `localhost:8000` (Express server)
- Vite proxy forwards `/api/*` to backend

## 📝 Important Notes

1. **Free Tier Limitations**:
   - Render free tier spins down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds to wake up
   - Upgrade to paid plan for 24/7 uptime

2. **MongoDB Atlas**:
   - Make sure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Or add Render's IP addresses to the whitelist

3. **Build Time**:
   - First deployment takes longer
   - Subsequent deployments are faster

## 🔧 Troubleshooting

**Build Fails:**
- Check Node.js version (add `NODE_VERSION=18` to environment variables)
- Verify all dependencies are in `package.json`

**MongoDB Connection Issues:**
- Check MongoDB Atlas network access settings
- Verify connection string is correct

**App Not Loading:**
- Check Render logs: Dashboard → Your Service → Logs
- Look for error messages

## 🎉 Done!

Your app is now live! Share the Render URL with others to use your Live Poll App.

**Example URL**: `https://live-poll-app-xyz.onrender.com`

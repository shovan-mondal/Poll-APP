# 🚀 RENDER DEPLOYMENT - QUICK GUIDE

## What I've Set Up For You:

### ✅ Single Service Deployment
Your app now runs **both frontend and backend** in one Render service!

### 📁 Changes Made:

1. **`server/index.ts`**:
   - Added static file serving for production
   - Serves built React app from `dist/` folder
   - API routes at `/api/*`
   - Everything else serves the React app

2. **`package.json`**:
   - `npm run build` → Builds React frontend to `dist/`
   - `npm start` → Starts production server (serves both API + frontend)

3. **`.gitignore`**:
   - Added environment files to prevent committing secrets

---

## 🎯 DEPLOYMENT STEPS:

### 1. Push to GitHub/GitLab
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Create Render Web Service

Go to: https://dashboard.render.com/

**Click "New +" → "Web Service"**

### 3. Configure Service:

| Setting | Value |
|---------|-------|
| **Name** | `live-poll-app` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### 4. Add Environment Variables:

Click "Advanced" → Add these:

```
NODE_ENV = production
MONGODB_URI = mongodb+srv://emithru:emit_cmrit_2025@fsdproject.hojgqql.mongodb.net/Live-poll
```

### 5. Deploy!

Click **"Create Web Service"** and wait 5-10 minutes.

---

## 🌐 Your Live URL:

After deployment completes, you'll get:
```
https://live-poll-app-xyz.onrender.com
```

**Everything runs on ONE URL:**
- Homepage: `https://your-app.onrender.com/`
- API: `https://your-app.onrender.com/api/polls`
- Admin: `https://your-app.onrender.com/` (click Create Poll)

---

## ⚠️ Important:

1. **MongoDB Atlas**: Make sure network access allows all IPs (0.0.0.0/0)
2. **Free Tier**: App sleeps after 15 min inactivity (first request takes 30-60s to wake)
3. **Logs**: Check Render dashboard → Your Service → Logs if issues occur

---

## ✅ Test Locally First:

```bash
# Build the frontend
npm run build

# Start production server (serves both API + built frontend)
npm start
```

Visit: `http://localhost:8000`

---

## 🎉 That's It!

Your Live Poll App will be live on Render with both frontend and backend running together!

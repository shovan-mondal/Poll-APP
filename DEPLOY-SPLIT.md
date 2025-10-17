# 🎯 EASIEST DEPLOYMENT GUIDE

## Deploy Backend to Fly.io + Frontend to Render

### Why This Setup?
- ✅ **Free**: Both platforms have generous free tiers
- ✅ **Fast**: Better performance than single service
- ✅ **Scalable**: Each service scales independently
- ✅ **Simple**: Follow these steps!

---

## 🚀 STEP 1: Deploy Backend to Fly.io (5 minutes)

### A. Install Fly CLI

Open PowerShell and run:
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

Restart your terminal after installation.

### B. Login to Fly.io
```bash
fly auth login
```

### C. Deploy Backend

Run this single command:
```powershell
.\deploy-fly.ps1
```

Or manually:
```bash
# 1. Launch (first time only)
fly launch --no-deploy

# 2. Set secrets (replace with your actual MongoDB connection string)
fly secrets set MONGODB_URI="<YOUR_MONGODB_CONNECTION_STRING>"

# 3. Deploy
fly deploy
```

### D. Get Your API URL

```bash
fly info
```

Copy the URL (looks like: `https://live-poll-api.fly.dev`)

**✅ Backend Done!**

---

## 🎨 STEP 2: Deploy Frontend to Render (5 minutes)

### A. Update .env.production

Replace the URL in `.env.production` with your Fly.io URL:
```
VITE_API_URL=https://YOUR-FLY-APP.fly.dev
```

### B. Push to GitHub

```bash
git add .
git commit -m "Configure Fly.io backend"
git push
```

### C. Deploy to Render

1. Go to: https://dashboard.render.com/
2. Click **"New +"** → **"Static Site"**
3. Connect your repo: **shovan-mondal/Poll-APP**
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - Add: `VITE_API_URL` = `https://YOUR-FLY-APP.fly.dev`
5. Click **"Create Static Site"**

**✅ Frontend Done!**

---

## 🎉 DONE! Your App is Live!

**Frontend**: `https://live-poll-app.onrender.com`
**Backend**: `https://live-poll-api.fly.dev`

---

## 💰 Cost Breakdown:

| Service | Free Tier | Limits |
|---------|-----------|---------|
| **Fly.io** | 3 VMs @ 256MB | 160GB bandwidth/month |
| **Render Static** | Unlimited | 100GB bandwidth/month |
| **Total** | **$0/month** | Good for 1000s of users |

---

## 📊 Can Handle:

- ✅ 100 concurrent users easily
- ✅ 1000+ polls per day
- ✅ Fast global performance
- ✅ Auto-scaling if needed

---

## 🔧 Useful Commands:

```bash
# View backend logs
fly logs

# Check backend status
fly status

# Scale backend (if needed)
fly scale count 2

# Deploy updates
fly deploy
```

---

## 🚨 Troubleshooting:

**CORS Error:**
Backend doesn't allow frontend domain. Check `server/index.ts` CORS config.

**API Not Found:**
Wrong `VITE_API_URL`. Check .env.production and Render environment variables.

**Fly App Sleeping:**
Free tier sleeps after inactivity. First request takes 5-10 seconds to wake.

---

Ready to deploy? Start with Step 1! 🚀

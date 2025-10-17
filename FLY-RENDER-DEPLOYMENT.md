# 🚀 SPLIT DEPLOYMENT GUIDE

Deploy backend on Fly.io and frontend on Render for better scalability!

---

## PART 1: Deploy Backend to Fly.io

### Step 1: Install Fly.io CLI

**Windows:**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login to Fly.io
```bash
fly auth login
```

### Step 3: Launch Your Backend
```bash
fly launch
```

When prompted:
- **App name**: `live-poll-api` (or your choice)
- **Region**: Choose closest to you
- **PostgreSQL**: No (we're using MongoDB)
- **Deploy now**: No

### Step 4: Set Environment Variables
```bash
fly secrets set MONGODB_URI="<YOUR_MONGODB_CONNECTION_STRING>"
fly secrets set NODE_ENV="production"
```

**Note**: Replace `<YOUR_MONGODB_CONNECTION_STRING>` with your actual MongoDB Atlas connection string.

### Step 5: Deploy!
```bash
fly deploy
```

### Step 6: Get Your API URL
```bash
fly info
```

Your API will be at: `https://live-poll-api.fly.dev`

**Copy this URL - you'll need it for frontend!**

---

## PART 2: Deploy Frontend to Render

### Step 1: Update API URL

In your code, we need to point to Fly.io backend instead of localhost.

Create a `.env.production` file with:
```
VITE_API_URL=https://live-poll-api.fly.dev
```

### Step 2: Update vite.config.ts for Production

The Vite proxy only works in development. For production, we need to use the actual API URL.

### Step 3: Push Changes to GitHub
```bash
git add .
git commit -m "Configure for split deployment"
git push
```

### Step 4: Deploy to Render

Go to: https://dashboard.render.com/

**Create Static Site:**
- Click **"New +"** → **"Static Site"**
- Connect repository: `shovan-mondal/Poll-APP`
- Configure:
  - **Build Command**: `npm install && npm run build`
  - **Publish Directory**: `dist`
  - **Environment Variables**:
    - `VITE_API_URL` = `https://live-poll-api.fly.dev`

- Click **"Create Static Site"**

### Step 5: Done!

Your app is now live:
- **Frontend**: `https://live-poll-app.onrender.com`
- **Backend**: `https://live-poll-api.fly.dev`

---

## ✅ Benefits of This Setup:

1. **Better Performance**: Static hosting is faster
2. **Free Tier**: Render static sites are free forever
3. **Scalability**: Fly.io has better autoscaling
4. **Separation**: Frontend and backend scale independently
5. **Cost**: Free for moderate traffic!

---

## 💰 Pricing:

- **Fly.io**: Free tier includes 3 VMs (256MB each)
- **Render Static**: Free forever
- **Total**: $0/month for moderate usage!

---

## 🔧 Troubleshooting:

**CORS Issues:**
Make sure your backend allows requests from Render domain.

**API Not Found:**
Check that `VITE_API_URL` is correctly set in Render environment.

**Fly.io Sleep:**
Free tier apps sleep after inactivity. First request takes ~5s to wake.

---

Ready to deploy? Start with Fly.io backend first!

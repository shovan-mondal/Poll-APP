# 🚀 Deploy to Fly.io as "api-testing"

## Quick Deploy Steps:

### 1. Login to Fly.io (if not already logged in)
```bash
fly auth login
```

### 2. Create the app (first time only)
```bash
fly apps create api-testing
```

### 3. Set Environment Variables
```bash
fly secrets set MONGODB_URI="<YOUR_MONGODB_CONNECTION_STRING>" -a api-testing
fly secrets set NODE_ENV="production" -a api-testing
```

**Note**: Replace `<YOUR_MONGODB_CONNECTION_STRING>` with your actual MongoDB Atlas connection string.

### 4. Deploy!
```bash
fly deploy -a api-testing
```

### 5. Check Status
```bash
fly status -a api-testing
```

---

## Your API URLs:

After deployment, your backend will be available at:
- **Main URL**: `https://api-testing.fly.dev`
- **API Endpoint**: `https://api-testing.fly.dev/api/polls`

---

## Update Frontend Configuration:

In `.env.production`, use:
```
VITE_API_URL=https://api-testing.fly.dev
```

---

## Useful Commands:

```bash
# View logs
fly logs -a api-testing

# Check app info
fly info -a api-testing

# SSH into the machine
fly ssh console -a api-testing

# Scale the app
fly scale count 2 -a api-testing

# Restart the app
fly apps restart api-testing

# Delete the app (if needed)
fly apps destroy api-testing
```

---

## Multiple Apps on Same Fly.io Account:

You can have multiple apps! Your Fly.io account will now have:
1. Your existing site
2. **api-testing** (this Live Poll API)

Each app has its own URL and resources.

---

## Next Steps:

1. Deploy backend with: `fly deploy -a api-testing`
2. Update `.env.production` with: `VITE_API_URL=https://api-testing.fly.dev`
3. Push to GitHub: `git push`
4. Deploy frontend to Render

Done! 🎉

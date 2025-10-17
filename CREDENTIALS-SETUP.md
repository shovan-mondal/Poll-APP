# 🔐 Credentials Setup Guide

**⚠️ IMPORTANT: Never commit credentials to GitHub!**

This guide shows you where to set your sensitive credentials safely.

---

## 📝 Required Credentials

### 1. MongoDB Connection String

**Where to get it:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

**Where to use it:**

#### For Local Development:
Create `.env.local` file (already in .gitignore):
```env
VITE_MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
```

Create `server/.env` file (already in .gitignore):
```env
MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
PORT=8000
```

#### For Production (Fly.io):
```bash
fly secrets set MONGODB_URI="<YOUR_MONGODB_CONNECTION_STRING>" -a reporting-api-testing
```

#### For Production (Render):
Add in Render Dashboard → Environment Variables:
- Key: `MONGODB_URI`
- Value: `<YOUR_MONGODB_CONNECTION_STRING>`

---

## 🛡️ Security Best Practices

### ✅ DO:
- ✅ Keep credentials in `.env` files (they're in .gitignore)
- ✅ Use environment variables for all sensitive data
- ✅ Use `fly secrets` for Fly.io deployment
- ✅ Use Render's environment variable settings
- ✅ Rotate credentials if accidentally exposed

### ❌ DON'T:
- ❌ Never commit `.env` files to GitHub
- ❌ Never hardcode credentials in source code
- ❌ Never share credentials in public documentation
- ❌ Never commit `server/.env` to GitHub

---

## 🔍 Verify Your Setup

Check that your `.gitignore` includes:
```
.env
.env.local
.env.production
server/.env
```

Check git status:
```bash
git status
```

If you see `.env` files listed, they're NOT protected! Add them to `.gitignore` immediately.

---

## 🚨 If Credentials Were Exposed

If you accidentally committed credentials:

1. **Immediately rotate them** in MongoDB Atlas
2. **Remove from git history**:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch server/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push**:
   ```bash
   git push origin --force --all
   ```
4. **Update all deployment secrets** with new credentials

---

## 📚 Files That Should NOT Be Committed

These files are automatically ignored by `.gitignore`:

- `.env` - Root environment file
- `.env.local` - Local development settings
- `.env.production` - Production settings (use Fly/Render instead)
- `server/.env` - Server-specific environment file
- `*.local` - Any file ending in .local

---

## ✅ Your Current Setup

Your project is now secure:
- ✅ All credentials removed from documentation
- ✅ `.gitignore` properly configured
- ✅ Code requires environment variables (no defaults)
- ✅ Deployment guides use placeholders

**Keep it secure!** 🔒

# Live Poll App - Quick Start Guide

## 📁 Environment Files Explained

### `.env.local` (Root folder)
- Used by **Vite frontend**
- Contains frontend configuration (GEMINI_API_KEY, etc.)
- Only variables prefixed with `VITE_` are exposed to the browser

### `server/.env` (Server folder)
- Used by **Express backend**
- Contains MongoDB connection string and port
- Never exposed to the browser (secure)

## 🚀 How to Run

You need **TWO terminals**:

### Terminal 1 - Backend Server (Port 3001)
```bash
npm run server:watch
```

### Terminal 2 - Frontend (Port 3000)
```bash
npm run dev
```

## 🔧 How It Works

1. **Frontend runs on**: `http://localhost:3000`
2. **Backend API runs on**: `http://localhost:3001`
3. **Vite Proxy**: When frontend makes requests to `/api/*`, Vite automatically forwards them to `http://localhost:3001/api/*`

### Example:
```javascript
// In your code you call:
fetch('/api/polls')

// Vite proxy forwards it to:
// http://localhost:3001/api/polls
```

**You only visit `http://localhost:3000` in your browser!** ✨

The proxy makes it appear as if everything is on port 3000, but behind the scenes:
- Static files (HTML, CSS, JS) → Vite (port 3000)
- API calls (`/api/*`) → Express backend (port 3001)

## ✅ Success Messages

When both are running, you should see:

**Terminal 1:**
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3001
```

**Terminal 2:**
```
VITE ready
➜ Local: http://localhost:3000/
```

Then open **http://localhost:3000** in your browser! 🎉

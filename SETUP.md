# Live Poll App - Setup Instructions

This Live Poll App has been updated to use **MongoDB directly** instead of the deprecated Atlas App Services (Realm).

## Architecture

- **Frontend**: React + Vite (Port 3000)
- **Backend**: Express.js API server (Port 3000)
- **Database**: MongoDB Atlas

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your credentials:

```env
GEMINI_API_KEY=your-gemini-api-key
VITE_MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
VITE_API_URL=http://localhost:3000
```

**Note**: Replace `<YOUR_MONGODB_CONNECTION_STRING>` with your actual MongoDB Atlas connection string.

### 3. Run the Application

You need to run **both** the frontend and backend servers:

#### Option A: Two Terminal Windows

**Terminal 1 - Backend Server:**
```bash
npm run server:watch
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option B: Using Concurrently (Recommended)

Add this to your workflow or use separate terminals as shown above.

### 4. Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:3000

## How It Works

1. **Backend Server** (`server/index.ts`):
   - Connects directly to MongoDB Atlas
   - Provides REST API endpoints for poll operations
   - Handles all database operations

2. **Frontend** (React app):
   - Calls the backend API
   - Uses polling (every 2 seconds) for real-time updates
   - No Realm/App Services dependency

## API Endpoints

- `POST /api/polls` - Create a new poll
- `GET /api/polls/:pollId` - Get poll details
- `POST /api/polls/:pollId/vote` - Add a vote
- `POST /api/polls/:pollId/end` - End a poll
- `DELETE /api/polls/:pollId` - Delete a poll

## Database Structure

Database: `pollApp`
Collection: `polls`

Each poll document:
```json
{
  "id": "ABC123",
  "options": [
    { "id": "opt1", "caption": "Option 1", "image": "base64..." },
    { "id": "opt2", "caption": "Option 2", "image": "base64..." }
  ],
  "status": "ACTIVE" | "ENDED",
  "votes": {
    "opt1": 5,
    "opt2": 3,
    "none": 1
  },
  "createdAt": "2025-10-17T..."
}
```

## Removed Dependencies

- ❌ `realm-web` (deprecated)
- ❌ Atlas App Services
- ❌ Realm authentication

## New Dependencies

- ✅ `express` - Backend web server
- ✅ `mongodb` - MongoDB driver
- ✅ `cors` - Cross-origin requests
- ✅ `tsx` - TypeScript execution

## Production Deployment

For production, you'll need to:

1. Deploy the backend to a hosting service (Render, Railway, Heroku, etc.)
2. Update `VITE_API_URL` in `.env.local` to point to your deployed backend
3. Build and deploy the frontend (Netlify, Vercel, etc.)

## Troubleshooting

If you get connection errors:
1. Make sure both servers are running
2. Check that MongoDB connection string is correct
3. Verify firewall/network access to MongoDB Atlas

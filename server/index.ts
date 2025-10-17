import express from 'express';
import cors from 'cors';
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from server/.env (only in development)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load .env file if not in production (Fly.io provides env vars directly)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection with optimized settings for burst traffic
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://emithru:emit_cmrit_2025@fsdproject.hojgqql.mongodb.net/Live-poll';
let db: Db;

// Connect to MongoDB with connection pooling optimized for 100+ concurrent users
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 100, // Support up to 100 concurrent connections
      minPoolSize: 10,  // Keep 10 connections ready
      maxIdleTimeMS: 30000, // Close idle connections after 30s
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
    });
    await client.connect();
    db = client.db('pollApp');
    console.log('✅ Connected to MongoDB with optimized pool settings');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectToDatabase, 5000);
  }
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow frontend domain
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images

// Serve static files from the dist folder in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
}

// Helper function to generate unique poll ID
function generatePollId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// API Routes

// Create a new poll
app.post('/api/polls', async (req, res) => {
  try {
    const { options } = req.body;
    
    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options required' });
    }

    const pollId = generatePollId();
    
    // Create poll options with IDs
    const pollOptions = options.map((opt: any, index: number) => ({
      id: `opt${index + 1}`,
      caption: opt.caption,
      image: opt.image,
    }));

    // Initialize vote counts
    const votes: Record<string, number> = { none: 0 };
    pollOptions.forEach((opt: any) => {
      votes[opt.id] = 0;
    });

    const poll = {
      id: pollId,
      options: pollOptions,
      status: 'ACTIVE',
      votes,
      createdAt: new Date(),
    };

    await db.collection('polls').insertOne(poll);
    
    res.json(poll);
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

// Get a poll by ID
app.get('/api/polls/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = await db.collection('polls').findOne({ id: pollId.toUpperCase() });
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

// Add a vote to a poll
app.post('/api/polls/:pollId/vote', async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionId } = req.body;

    if (!optionId) {
      return res.status(400).json({ error: 'optionId is required' });
    }

    const result = await db.collection('polls').updateOne(
      { id: pollId.toUpperCase() },
      { $inc: { [`votes.${optionId}`]: 1 } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding vote:', error);
    res.status(500).json({ error: 'Failed to add vote' });
  }
});

// End a poll
app.post('/api/polls/:pollId/end', async (req, res) => {
  try {
    const { pollId } = req.params;

    const result = await db.collection('polls').updateOne(
      { id: pollId.toUpperCase() },
      { $set: { status: 'ENDED' } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error ending poll:', error);
    res.status(500).json({ error: 'Failed to end poll' });
  }
});

// Delete a poll (reset)
app.delete('/api/polls/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;

    const result = await db.collection('polls').deleteOne({ id: pollId.toUpperCase() });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting poll:', error);
    res.status(500).json({ error: 'Failed to delete poll' });
  }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

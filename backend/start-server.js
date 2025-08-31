import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Test Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        suggestion: error.message.includes('relation "users" does not exist') 
          ? 'Please run create_users_table.sql in Supabase SQL Editor'
          : 'Check Supabase configuration'
      });
    }

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      port: PORT
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Import auth routes
import authRoutes from './src/routes/auth.js';
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
});

export default app;

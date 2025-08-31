import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware and utilities
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { validateRequest } from './middleware/validation.js';

// Import routes
import authRoutes from './routes/auth.js';
import breedRoutes from './routes/breeds.js';
import animalRoutes from './routes/animals.js';
import identificationRoutes from './routes/identification.js';
import syncRoutes from './routes/sync.js';
import dashboardRoutes from './routes/dashboard.js';
import mlRoutes from './routes/ml.js';
import analyticsRoutes from './routes/analytics.js';
import photosRoutes from './routes/photos.js';

// Import database and cache
import { initDatabase } from './database/connection.js';
import { initRedis } from './utils/redis.js';
import { initQueue } from './utils/queue.js';

// Import ML service
import { SimpleMLService } from './services/simpleMLService.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Initialize Socket.IO for real-time features
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Static files (for PWA)
app.use(express.static(path.join(__dirname, '../../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/breeds', breedRoutes);
app.use('/api/animals', authMiddleware, animalRoutes);
app.use('/api/identify', identificationRoutes);
app.use('/api/sync', authMiddleware, syncRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/photos', photosRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // Handle sync status updates
  socket.on('join-sync-room', (userId) => {
    socket.join(`sync-${userId}`);
    logger.info(`User ${userId} joined sync room`);
  });

  // Handle breed identification progress
  socket.on('identification-progress', (data) => {
    socket.broadcast.to(`sync-${data.userId}`).emit('progress-update', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize services
async function initializeServices() {
  try {
    // Skip database initialization for now (using Supabase directly)
    logger.info('Using Supabase database - skipping local DB init');

    // Skip Redis for now (optional service)
    logger.info('Redis skipped - using in-memory cache');

    // Skip queue for now (optional service)
    logger.info('Queue system skipped - using direct processing');

    // Initialize ML service
    logger.info('Simple ML service ready');
    logger.info(`Available breeds: ${SimpleMLService.getAvailableBreeds().length}`);

  } catch (error) {
    logger.error('Failed to initialize services:', error);
    // Don't exit, continue with basic functionality
    logger.warn('Continuing with limited functionality');
  }
}

// Start server
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await initializeServices();
    
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export { app, io };

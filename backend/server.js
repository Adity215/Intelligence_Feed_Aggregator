require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Redis = require('redis');
const NodeCache = require('node-cache');
const winston = require('winston');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs-extra');

// Import routes and middleware
const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feeds');
const iocRoutes = require('./routes/iocs');
const analyticsRoutes = require('./routes/analytics');
const settingsRoutes = require('./routes/settings');
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

// Import services
const ThreatFeedService = require('./services/ThreatFeedService');
const IOCService = require('./services/IOCService');
const AIService = require('./services/AIService');
const NotificationService = require('./services/NotificationService');
const CacheService = require('./services/CacheService');

// Import models
const ThreatFeed = require('./models/ThreatFeed');
const IOC = require('./models/IOC');
const User = require('./models/User');
const Settings = require('./models/Settings');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configure Winston logger
const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'threat-intelligence-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Initialize services
const cacheService = new CacheService();
const threatFeedService = new ThreatFeedService();
const iocService = new IOCService();
const aiService = new AIService();
const notificationService = new NotificationService();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
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
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(limiter);
app.use(requestLogger);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/threat-intelligence', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

// Redis connection
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.connect().catch(console.error);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('Client connected:', socket.id);
  
  socket.on('join-dashboard', () => {
    socket.join('dashboard');
    logger.info('Client joined dashboard room');
  });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feeds', authenticateToken, feedRoutes);
app.use('/api/iocs', authenticateToken, iocRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/settings', authenticateToken, settingsRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const redisStatus = redisClient.isReady ? 'connected' : 'disconnected';
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: dbStatus,
      redis: redisStatus,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: require('./package.json').version
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// API Documentation
if (NODE_ENV !== 'production') {
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Threat Intelligence API',
        version: '2.0.0',
        description: 'AI-Powered Threat Intelligence Feed Aggregator API',
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./routes/*.js'],
  };
  
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Scheduled tasks
const initializeScheduledTasks = () => {
  // Feed collection every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      logger.info('Starting scheduled feed collection');
      await threatFeedService.collectFeeds();
      await iocService.extractIOCs();
      await aiService.generateSummaries();
      
      // Notify connected clients
      io.to('dashboard').emit('data-updated', {
        timestamp: new Date().toISOString(),
        message: 'Threat intelligence data updated'
      });
      
      logger.info('Scheduled feed collection completed');
    } catch (error) {
      logger.error('Scheduled feed collection error:', error);
    }
  });

  // Cleanup old data every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('Starting data cleanup');
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      await ThreatFeed.deleteMany({ timestamp: { $lt: thirtyDaysAgo } });
      await IOC.deleteMany({ firstSeen: { $lt: thirtyDaysAgo } });
      
      logger.info('Data cleanup completed');
    } catch (error) {
      logger.error('Data cleanup error:', error);
    }
  });

  // Generate daily report every day at 6 AM
  cron.schedule('0 6 * * *', async () => {
    try {
      logger.info('Generating daily report');
      const report = await aiService.generateDailyReport();
      await notificationService.sendDailyReport(report);
      logger.info('Daily report generated and sent');
    } catch (error) {
      logger.error('Daily report generation error:', error);
    }
  });
};

// Initialize application
const initializeApp = async () => {
  try {
    // Create logs directory if it doesn't exist
    await fs.ensureDir('logs');
    
    // Initialize cache
    await cacheService.initialize();
    
    // Initialize services
    await threatFeedService.initialize();
    await iocService.initialize();
    await aiService.initialize();
    await notificationService.initialize();
    
    // Initialize scheduled tasks
    initializeScheduledTasks();
    
    // Load initial data if database is empty
    const feedCount = await ThreatFeed.countDocuments();
    if (feedCount === 0) {
      logger.info('Loading initial sample data');
      await threatFeedService.loadSampleData();
    }
    
    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Application initialization error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close server
    server.close(() => {
      logger.info('HTTP server closed');
    });
    
    // Close database connections
    await mongoose.connection.close();
    await redisClient.quit();
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
server.listen(PORT, async () => {
  logger.info(`🚀 Threat Intelligence Aggregator running on port ${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
  
  await initializeApp();
  
  logger.info('✅ Application ready to collect threat intelligence');
});

module.exports = app;

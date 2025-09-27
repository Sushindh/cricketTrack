require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize express app first
const app = express();
// Basic middleware (always available)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/players', require('./routes/players'));
// Optional middleware with error handling
try {
  const helmet = require('helmet');
  app.use(helmet());
  console.log('✅ Helmet security middleware loaded');
} catch (error) {
  console.log('⚠️  Helmet not available, skipping security middleware');
}

try {
  const morgan = require('morgan');
  app.use(morgan('combined'));
  console.log('✅ Morgan logging middleware loaded');
} catch (error) {
  console.log('⚠️  Morgan not available, skipping logging middleware');
}

try {
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api', limiter);
  console.log('✅ Rate limiting middleware loaded');
} catch (error) {
  console.log('⚠️  Rate limiting not available, skipping');
}

// Database connection with error handling
try {
  const connectDB = require('./config/db');
  connectDB();
  console.log('✅ Database connection module loaded');
} catch (error) {
  console.log('⚠️  Database connection module not found, using fallback');
  // Fallback: Basic MongoDB connection
  try {
    const mongoose = require('mongoose');
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket-track')
      .then(() => console.log('✅ MongoDB Connected (fallback)'))
      .catch(err => console.log('❌ MongoDB Error:', err.message));
  } catch (mongoError) {
    console.log('⚠️  MongoDB not available, running without database');
  }
}

// Routes with error handling
const routesLoaded = {
  auth: false,
  matches: false,
  players: false,
  favorites: false,
  chat: false,
  alerts: false
};

// Load routes with try-catch
try {
  app.use('/api/auth', require('./routes/auth'));
  routesLoaded.auth = true;
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('⚠️  Auth routes not available');
  // Fallback route
  app.use('/api/auth', (req, res) => {
    res.status(503).json({ message: 'Auth service temporarily unavailable' });
  });
}

try {
  app.use('/api/matches', require('./routes/matches'));
  routesLoaded.matches = true;
  console.log('✅ Matches routes loaded');
} catch (error) {
  console.log('⚠️  Matches routes not available');
  app.use('/api/matches', (req, res) => {
    res.status(503).json({ message: 'Matches service temporarily unavailable' });
  });
}

try {
  app.use('/api/players', require('./routes/players'));
  routesLoaded.players = true;
  console.log('✅ Players routes loaded');
} catch (error) {
  console.log('⚠️  Players routes not available');
  app.use('/api/players', (req, res) => {
    res.status(503).json({ message: 'Players service temporarily unavailable' });
  });
}

try {
  app.use('/api/favorites', require('./routes/favorites'));
  routesLoaded.favorites = true;
  console.log('✅ Favorites routes loaded');
} catch (error) {
  console.log('⚠️  Favorites routes not available');
  app.use('/api/favorites', (req, res) => {
    res.status(503).json({ message: 'Favorites service temporarily unavailable' });
  });
}

try {
  app.use('/api/chat', require('./routes/chat'));
  routesLoaded.chat = true;
  console.log('✅ Chat routes loaded');
} catch (error) {
  console.log('⚠️  Chat routes not available');
  app.use('/api/chat', (req, res) => {
    res.status(503).json({ message: 'Chat service temporarily unavailable' });
  });
}

try {
  app.use('/api/alerts', require('./routes/alerts'));
  routesLoaded.alerts = true;
  console.log('✅ Alerts routes loaded');
} catch (error) {
  console.log('⚠️  Alerts routes not available');
  app.use('/api/alerts', (req, res) => {
    res.status(503).json({ message: 'Alerts service temporarily unavailable' });
  });
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cricket Track API is running',
    timestamp: new Date().toISOString(),
    services: routesLoaded,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Cron job with error handling
try {
  const cron = require('node-cron');
  const { checkMatchAlerts } = require('./services/emailService');
  
  cron.schedule('*/15 * * * *', () => {
    console.log('Checking for match alerts...');
    try {
      checkMatchAlerts();
    } catch (error) {
      console.error('Error in cron job:', error.message);
    }
  });
  console.log('✅ Cron job scheduled');
} catch (error) {
  console.log('⚠️  Cron job not available, alerts will be manual');
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  
  // Don't log errors in test environment
  if (process.env.NODE_ENV !== 'test') {
    console.error(`❌ Error ${err.status || 500}: ${err.message}`);
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
    timestamp: new Date().toISOString()
  });
});

// Handle async errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// 404 handler (must be last)
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  
  // Show which services are available
  const available = Object.entries(routesLoaded)
    .filter(([, loaded]) => loaded)
    .map(([service]) => service);
  
  if (available.length > 0) {
    console.log(`✅ Available services: ${available.join(', ')}`);
  }
  
  const unavailable = Object.entries(routesLoaded)
    .filter(([, loaded]) => !loaded)
    .map(([service]) => service);
    
  if (unavailable.length > 0) {
    console.log(`⚠️  Unavailable services: ${unavailable.join(', ')}`);
  }
});

module.exports = app;

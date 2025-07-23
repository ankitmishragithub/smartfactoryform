// Simple server launcher that doesn't require npm
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const formRoutes = require('./routes/forms');
const responseRoutes = require('./routes/responses');

// Import fallback data
const fallbackData = require('./fallbackData');

async function startServer() {
  console.log('🚀 Starting Forms Backend Server...');
  
  const app = express();
  app.use(express.json());
  app.use(cors());

  // MongoDB connection
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/formsdb';
  let usingMongoDB = false;

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB at:', mongoUri);
    usingMongoDB = true;
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, using fallback data');
    console.log('📝 Fallback includes sample forms and responses');
  }

  // Set global variables
  global.usingMongoDB = usingMongoDB;
  global.fallbackData = fallbackData;

  // Debug middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Mount routes
  app.use('/api/forms', formRoutes);
  app.use('/api/responses', responseRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'running',
      database: usingMongoDB ? 'MongoDB' : 'Fallback',
      timestamp: new Date().toISOString()
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🌟 Server running on http://localhost:${port}`);
    console.log(`📊 Database: ${usingMongoDB ? 'MongoDB Connected' : 'Fallback Mode'}`);
    console.log(`🔗 Test API: http://localhost:${port}/api/health`);
    console.log(`📝 Responses: http://localhost:${port}/api/responses`);
  });
}

// Start the server
startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
}); 
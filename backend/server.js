const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const workoutRoutes = require('./routes/workouts');
const sleepRoutes = require('./routes/sleep');
const nutritionRoutes = require('./routes/nutrition');
const healthRoutes = require('./routes/health');
const stressRoutes = require('./routes/stress');
const medicationRoutes = require('./routes/medications');
const challengeRoutes = require('./routes/challenges');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200,
});
app.use('/api', limiter);

// Mount API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/stress', stressRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/healthcheck', (req, res) => {
  res.json({
    status: 'Healthy',
    service: 'Smart FITNESS Tracker API',
    timestamp: new Date().toISOString(),
  });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-fitness-tracker';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`Smart FITNESS Tracker backend server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('MongoDB connection failed, starting server in offline mode:', err.message);
    app.listen(PORT, () => {
      console.log(`Smart FITNESS Tracker server running (offline fallback) on port ${PORT}`);
    });
  });

module.exports = app;

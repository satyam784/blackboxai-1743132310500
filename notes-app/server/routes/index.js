const express = require('express');
const authRouter = require('./authRoutes');
const noteRouter = require('./noteRoutes');

const router = express.Router();

// API version 1 routes
router.use('/api/v1/auth', authRouter);
router.use('/api/v1/notes', noteRouter);

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy'
  });
});

// 404 handler for undefined routes
router.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

module.exports = router;
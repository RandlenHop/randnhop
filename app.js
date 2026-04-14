const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/coupleRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use(errorHandler);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

module.exports = app;

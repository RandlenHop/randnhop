const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const staffRequestRoutes = require('./routes/staffRequestRoutes'); // Fixed line 9

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use((req, res, next) => {
  console.log(`Inbound -> ${req.method} ${req.url}`);
  next();
});

// 2. Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/staff-request', staffRequestRoutes); 

// 3. Catch-all for 404
app.use('*', (req, res) => {
  res.status(404).json({ msg: `Path not found: ${req.originalUrl}` });
});

// 4. Error handling middleware
app.use(errorHandler);

module.exports = app;
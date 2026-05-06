require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const xss = require('xss-clean'); 
const connectDB = require('./config/db');

//Route Imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const staffRequestRoutes = require('./routes/staffRequestRoutes');

// Middleware Imports 
const { notFound, errorHandlerMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

// Security & Global Middleware
app.use(helmet());
app.use(xss());

// Optimized CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://randles-hopkick-qkpn.vercel.app/" 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).send('<h1>Rand & Hop API</h1><p>Status:Working</p>');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/staff-request', staffRequestRoutes);

// Error Handling 
app.use(notFound);           
app.use(errorHandlerMiddleware); 

// Server Initialization
const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Database Connected...');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1); 
  }
};

start();
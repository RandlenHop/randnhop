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
/\.vercel\.app$/];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed = allowedOrigins.some(o =>
      (o instanceof RegExp)
        ? o.test(origin)
        : o === origin
    );

    if (isAllowed) {
      return callback(null, true);
    }

    console.error(`CORS Error: Origin ${origin} not allowed`);
    return callback(new Error('Not allowed by CORS'));
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],

  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
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
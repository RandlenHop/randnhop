const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv/config');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const deliveryRoutes = require('./routes/delivery');

app.use(express.json());

// Use git push heroku master to deploy

let allowedOrigins;
if (process.env.NODE_ENV === 'production') {
  allowedOrigins = ['https://www.swizzlloyddelivery.com'];
} else {
  allowedOrigins = ['http://localhost:3000'];
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Set CORS headers manually
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Connect Database
connectDB();

app.use('/api/user', userRoutes);
app.use('/api/delivery', deliveryRoutes);

// Error Middlewares
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Not found URL middleware
app.use(notFound);

// Error handler for the whole app
app.use(errorHandler);

const PORT = process.env.PORT || 4011;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

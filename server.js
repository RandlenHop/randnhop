require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const staffRequestRoutes = require('./routes/staffRequestRoutes');


app.get('/', (req, res) => {
  res.send('<h1>Rand & Hop API is running...</h1><p>Connect via frontend or Postman.</p>');
});

// 2. Import Middlewares 
const { notFound, errorHandlerMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

// 3. Standard Middleware
app.use(cors());
app.use(express.json());

// 4. Routes 
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/staff-request', staffRequestRoutes);

// 5. THE CATCH-ALLS 
app.use(notFound);           
app.use(errorHandlerMiddleware); 

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`🚀 Server flying on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
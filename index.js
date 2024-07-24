const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv/config');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const deliveryRoutes = require('./routes/delivery');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(express.json());

// Use git push heroku master to deploy

let origin;
if (process.env.NODE_ENV === 'production') {
  origin = [
    '*',
    'https://www.swizzlloyddelivery.com',
    // 'http://localhost:3000',
    // "https://www.swizzlloyddelivery.com/",
    // "https://swizzlloyddelivery.com",
    // "www.swizzlloyddelivery.com/",
    // "swizzlloyddelivery.com",
  ];
} else {
  origin = ['http://localhost:3000'];
}

const corsOptions = {
    origin: 'https://www.swizzlloyddelivery.com',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Set CORS headers manually
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With,Content-Type",
//     "Accept",
//     "Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });


// Connect Database
connectDB();

app.use('/api/user', userRoutes);
app.use('/api/delivery', deliveryRoutes);

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
   
  });
}

// Error Middlewares

//Not found URL middleware
app.use(notFound);

//Error handler for the whole app
app.use(errorHandler);

const PORT = process.env.PORT || 4011;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

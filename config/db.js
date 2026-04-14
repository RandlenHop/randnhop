const mongoose = require('mongoose');


const MONGO_URI= process.env.MONGO_URI_PRO;

const connectDB = async () => {
  try {
     const connection = await mongoose.connect(MONGO_URI);    

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }

  
};


module.exports = connectDB;
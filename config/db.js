const mongoose = require("mongoose");

const MONGO_URI =
  process.env.NODE_ENV == "production"
    ? process.env.MONGO_URI_PRO
    : process.env.MONGO_URI_DEV;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

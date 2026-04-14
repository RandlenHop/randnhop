const mongoose = require('mongoose');
require('dotenv').config();

const fixIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoose.connection.db.collection('users').dropIndex('username_1');
    console.log('Dropped index: username_1');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixIndex();

const mongoose = require('mongoose');

const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB conectado ✔');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

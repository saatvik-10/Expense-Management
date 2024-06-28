const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Server running on ${mongoose.connection.host}`.bgWhite);
  } catch (err) {
    console.log(`${err}`.bgRed);
  }
};

module.exports = connectDB;

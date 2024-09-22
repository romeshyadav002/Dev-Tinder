const mongoose = require('mongoose');

const connectDB = async (url) => {
  console.log('i am trying to connect Database');
  await mongoose.connect(url);
};

module.exports = { connectDB };

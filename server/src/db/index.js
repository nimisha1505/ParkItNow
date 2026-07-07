const mongoose = require('mongoose');
const { DB_NAME } = require('../constants');

/**
 * Connects to MongoDB.
 * Logs connection errors but does not exit the process to allow Express server to boot
 * and Mongoose to attempt background reconnections.
 */
const connectDB = async () => {
  try {
    const dbUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    const connectionInstance = await mongoose.connect(dbUri);
    console.log(`\n🟢 MongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`\n🔴 MongoDB connection FAILED: ${error.message}`);
    console.log('👉 Server is booting up without database connection. Mongoose will auto-reconnect once the database is online.');
  }
};

module.exports = connectDB;

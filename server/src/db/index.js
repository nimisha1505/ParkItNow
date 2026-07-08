import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

/**
 * Connects to MongoDB.
 */
const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    throw new Error("MONGODB_URI is missing in server/.env");
  }

  console.log("Connecting to MongoDB Atlas...");
  
  try {
    const connectionInstance = await mongoose.connect(dbUri, {
      dbName: process.env.DB_NAME || DB_NAME,
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB connected successfully. Connected host: ${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    console.error(`MongoDB connection FAILED: ${error.message}`);
    throw error;
  }
};

export default connectDB;

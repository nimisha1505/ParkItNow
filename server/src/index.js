import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables dynamically based on absolute path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from './app.js';
import connectDB from './db/index.js';

const PORT = process.env.PORT || 5000;

// Setup error listeners before server boots
process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught Exception! Shutting down server...', err);
  process.exit(1);
});

let server;

// Initialize database connection and listen
connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Server boot failed due to database connection issue:', err);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('🔴 Unhandled Promise Rejection! Shutting down server gracefully...', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables dynamically based on absolute path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = async () => {
  const dbModule = require('./db');
  await dbModule();
};

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
      console.log(`\n🚀 Server is running on port: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('🔴 Server boot failed due to database connection issue:', err);
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

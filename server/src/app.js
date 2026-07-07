const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/error.middleware');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// ==========================================
// 1. Global Middlewares
// ==========================================

// HTTP Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// HTTP Request Logger
app.use(morgan('dev'));

// JSON Body Parser (with limit control to prevent payloads flooding)
app.use(express.json({ limit: '16kb' }));

// URL Encoded Body Parser
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Cookie Parser middleware
app.use(cookieParser());

// ==========================================
// 2. Health Check & API Routes
// ==========================================
app.get('/api/v1/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, { status: 'UP', timestamp: new Date() }, 'Health check passed'));
});

// Auth Routes
const authRouter = require('./routes/auth.routes');
app.use('/api/v1/auth', authRouter);

// Vehicle Routes
const vehicleRouter = require('./routes/vehicle.routes');
app.use('/api/v1/vehicles', vehicleRouter);

// Parking Lot Routes
const parkingLotRouter = require('./routes/parkingLot.routes');
app.use('/api/v1/parking-lots', parkingLotRouter);

// Parking Slot Routes
const parkingSlotRouter = require('./routes/parkingSlot.routes');
app.use('/api/v1/parking-slots', parkingSlotRouter);

// ==========================================
// 3. Centralized Error Handler
// ==========================================
app.use(errorMiddleware);

module.exports = app;

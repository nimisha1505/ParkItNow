import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { ApiResponse } from './utils/apiResponse.js';

import authRouter from './routes/auth.routes.js';
import vehicleRouter from './routes/vehicle.routes.js';
import parkingLotRouter from './routes/parkingLot.routes.js';
import parkingSlotRouter from './routes/parkingSlot.routes.js';
import bookingRouter from './routes/booking.routes.js';
import qrRouter from './routes/qr.routes.js';
import adminDashboardRouter from './routes/adminDashboard.routes.js';

const app = express();

// ==========================================
// 1. Global Middlewares
// ==========================================

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// ==========================================
// 2. Health Check & API Routes
// ==========================================
app.get('/api/v1/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, { status: 'UP', timestamp: new Date() }, 'Health check passed'));
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/parking-lots', parkingLotRouter);
app.use('/api/v1/parking-slots', parkingSlotRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1', qrRouter);
app.use('/api/v1/admin/dashboard', adminDashboardRouter);

// ==========================================
// 3. Centralized Error Handler
// ==========================================
app.use(errorMiddleware);

export default app;

import { Router } from 'express';
import {
  generateQrPass,
  verifyQrPass,
  checkIn,
  checkOut,
} from '../controllers/qr.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateQrAction } from '../middlewares/qr.validator.js';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// User endpoints
router.post('/bookings/:bookingId/qr-pass', generateQrPass);

// Admin endpoints
router.post('/qr/verify', validateQrAction, verifyQrPass);
router.post('/qr/check-in', validateQrAction, checkIn);
router.post('/qr/check-out', validateQrAction, checkOut);

export default router;

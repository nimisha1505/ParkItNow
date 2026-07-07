const { Router } = require('express');
const {
  generateQrPass,
  verifyQrPass,
  checkIn,
  checkOut,
} = require('../controllers/qr.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { validateQrAction } = require('../validators/qr.validator');

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// User endpoints
router.post('/bookings/:bookingId/qr-pass', generateQrPass);

// Admin endpoints
router.post('/qr/verify', validateQrAction, verifyQrPass);
router.post('/qr/check-in', validateQrAction, checkIn);
router.post('/qr/check-out', validateQrAction, checkOut);

module.exports = router;

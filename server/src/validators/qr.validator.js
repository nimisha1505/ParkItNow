const ApiError = require('../utils/apiError');

/**
 * Validate incoming QR verification and action payload.
 */
const validateQrAction = (req, res, next) => {
  const { bookingReference, qrToken } = req.body;
  const errors = [];

  if (!bookingReference || bookingReference.trim() === '') {
    errors.push('Booking reference is required');
  }

  if (!qrToken || qrToken.trim() === '') {
    errors.push('QR token is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = {
  validateQrAction,
};

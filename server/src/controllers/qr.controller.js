const qrService = require('../services/qr.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');

/**
 * Controller to generate a QR pass (Booking owner only).
 */
const generateQrPass = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const qrPass = await qrService.generateQrPass(req.user._id, bookingId);

  return res
    .status(200)
    .json(new ApiResponse(200, qrPass, 'QR Pass generated successfully'));
});

/**
 * Controller to verify a QR pass (Admin only).
 */
const verifyQrPass = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { bookingReference, qrToken } = req.body;
  const booking = await qrService.verifyQrPass(bookingReference, qrToken);
  const safeDetails = qrService.getSafeBookingDetails(booking);

  return res
    .status(200)
    .json(new ApiResponse(200, safeDetails, 'QR Pass verified successfully'));
});

/**
 * Controller to process check-in (Admin only).
 */
const checkIn = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { bookingReference, qrToken } = req.body;
  const result = await qrService.checkIn(req.user._id, bookingReference, qrToken);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Check-in processed successfully'));
});

/**
 * Controller to process check-out (Admin only).
 */
const checkOut = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { bookingReference, qrToken } = req.body;
  const result = await qrService.checkOut(req.user._id, bookingReference, qrToken);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Check-out processed successfully'));
});

module.exports = {
  generateQrPass,
  verifyQrPass,
  checkIn,
  checkOut,
};

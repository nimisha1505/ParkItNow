const bookingService = require('../services/booking.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');

/**
 * Controller to create a new booking.
 */
const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.user._id, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, booking, 'Booking created successfully'));
});

/**
 * Controller to fetch bookings of the authenticated driver.
 */
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, bookings, 'Bookings retrieved successfully'));
});

/**
 * Controller to retrieve details of a specific booking.
 */
const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const isAdmin = req.user.role === 'admin';

  const booking = await bookingService.getBookingById(req.user._id, bookingId, isAdmin);
  return res
    .status(200)
    .json(new ApiResponse(200, booking, 'Booking retrieved successfully'));
});

/**
 * Controller to cancel an active confirmed booking.
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { cancellationReason } = req.body;
  const isAdmin = req.user.role === 'admin';

  const booking = await bookingService.cancelBooking(
    req.user._id,
    bookingId,
    cancellationReason,
    isAdmin
  );

  return res
    .status(200)
    .json(new ApiResponse(200, booking, 'Booking cancelled successfully'));
});

/**
 * Controller to fetch all bookings (Admin only).
 */
const getAllBookings = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { status, parkingLotId, startDate, endDate } = req.query;
  const bookings = await bookingService.getAllBookings({
    status,
    parkingLotId,
    startDate,
    endDate,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, 'All bookings retrieved successfully'));
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};

const { Router } = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
} = require('../controllers/booking.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const {
  validateCreateBooking,
  validateCancelBooking,
} = require('../validators/booking.validator');

const router = Router();

// All booking routes require authentication
router.use(verifyJWT);

router
  .route('/')
  .post(validateCreateBooking, createBooking)
  .get(getAllBookings);

router.get('/my-bookings', getMyBookings);

router.route('/:bookingId').get(getBookingById);

router.patch('/:bookingId/cancel', validateCancelBooking, cancelBooking);

module.exports = router;

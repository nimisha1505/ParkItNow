import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
} from '../controllers/booking.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  validateCreateBooking,
  validateCancelBooking,
} from '../middlewares/booking.validator.js';

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

export default router;

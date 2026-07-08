import crypto from 'crypto';
import QRCode from 'qrcode';
import Booking from '../models/booking.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getSafeBookingDetails = (booking) => {
  return {
    bookingReference: booking.bookingReference,
    parkingLot: booking.parkingLot,
    parkingSlot: booking.parkingSlot,
    vehicle: booking.vehicle,
    startTime: booking.startTime,
    endTime: booking.endTime,
    entryStatus: booking.entryStatus,
  };
};

const verifyQrHelper = async (bookingReference, qrToken) => {
  if (!bookingReference || !qrToken) {
    throw new ApiError(400, 'Booking reference and QR token are required');
  }

  const booking = await Booking.findOne({ bookingReference: bookingReference.toUpperCase() })
    .populate('user', 'name email')
    .populate('parkingLot')
    .populate('parkingSlot')
    .populate('vehicle');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (['cancelled', 'completed', 'expired'].includes(booking.status)) {
    throw new ApiError(400, `Booking cannot be verified because it is ${booking.status}`);
  }

  if (!booking.qrTokenHash) {
    throw new ApiError(400, 'No QR Pass has been generated for this booking');
  }

  const hash = crypto.createHash('sha256').update(qrToken).digest('hex');
  if (hash !== booking.qrTokenHash) {
    throw new ApiError(400, 'Invalid or tampered QR pass');
  }

  return booking;
};

export const generateQrPass = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Forbidden: You can only generate QR passes for your own bookings');
  }

  if (booking.status !== 'confirmed') {
    throw new ApiError(400, 'QR Pass can only be generated for confirmed bookings');
  }

  const qrToken = crypto.randomBytes(32).toString('hex');
  const qrTokenHash = crypto.createHash('sha256').update(qrToken).digest('hex');

  booking.qrTokenHash = qrTokenHash;
  booking.qrIssuedAt = new Date();
  await booking.save();

  const qrPayload = JSON.stringify({
    bookingReference: booking.bookingReference,
    qrToken,
  });

  const qrCodeImage = await QRCode.toDataURL(qrPayload);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          bookingReference: booking.bookingReference,
          qrCode: qrCodeImage,
        },
        'QR Pass generated successfully'
      )
    );
});

export const verifyQrPass = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { bookingReference, qrToken } = req.body;
  const booking = await verifyQrHelper(bookingReference, qrToken);
  const safeDetails = getSafeBookingDetails(booking);

  return res
    .status(200)
    .json(new ApiResponse(200, safeDetails, 'QR Pass verified successfully'));
});

export const checkIn = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { bookingReference, qrToken } = req.body;
  const booking = await verifyQrHelper(bookingReference, qrToken);

  if (booking.entryStatus === 'checked_in') {
    throw new ApiError(400, 'Booking is already checked in');
  }

  if (booking.entryStatus === 'checked_out') {
    throw new ApiError(400, 'Booking is already checked out');
  }

  booking.entryStatus = 'checked_in';
  booking.checkedInAt = new Date();
  booking.verifiedBy = req.user._id;
  await booking.save();

  const result = getSafeBookingDetails(booking);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Check-in processed successfully'));
});

export const checkOut = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { bookingReference, qrToken } = req.body;
  const booking = await verifyQrHelper(bookingReference, qrToken);

  if (booking.entryStatus === 'not_checked_in') {
    throw new ApiError(400, 'User must be checked in before check-out is allowed');
  }

  if (booking.entryStatus === 'checked_out') {
    throw new ApiError(400, 'Booking is already checked out');
  }

  booking.entryStatus = 'checked_out';
  booking.checkedOutAt = new Date();
  booking.status = 'completed';
  booking.verifiedBy = req.user._id;
  await booking.save();

  const result = getSafeBookingDetails(booking);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Check-out processed successfully'));
});

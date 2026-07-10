import crypto from 'crypto';
import Booking from '../models/booking.model.js';
import Vehicle from '../models/vehicle.model.js';
import ParkingLot from '../models/parkingLot.model.js';
import ParkingSlot from '../models/parkingSlot.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBooking = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { parkingLot, parkingSlot, vehicle, startTime, endTime } = req.body;

  // 1. Verify vehicle exists and belongs to the user
  const vehicleDoc = await Vehicle.findOne({ _id: vehicle, owner: userId });
  if (!vehicleDoc) {
    throw new ApiError(403, 'Forbidden: You can only book using your own vehicle');
  }

  // 2. Verify parking lot exists and is active
  const lotDoc = await ParkingLot.findById(parkingLot);
  if (!lotDoc || !lotDoc.isActive) {
    throw new ApiError(400, 'Invalid request: Selected parking lot is not active');
  }

  // 3. Verify parking slot exists and belongs to the parking lot
  const slotDoc = await ParkingSlot.findById(parkingSlot);
  if (!slotDoc || slotDoc.parkingLot.toString() !== lotDoc._id.toString()) {
    throw new ApiError(400, 'Invalid request: Selected parking slot does not belong to the parking lot');
  }

  // 4. Verify vehicle type is supported by both lot and slot
  const lotSupports = lotDoc.supportedVehicleTypes.includes(vehicleDoc.type);
  const slotSupports = slotDoc.supportedVehicleTypes.includes(vehicleDoc.type);
  if (!lotSupports || !slotSupports) {
    throw new ApiError(400, `Vehicle type (${vehicleDoc.type}) is not supported in this slot/lot`);
  }

  // 5. Reject slots that are not available
  if (slotDoc.status !== 'available') {
    throw new ApiError(400, `Selected parking slot is not available (current status: ${slotDoc.status})`);
  }

  // 6. Prevent overlapping bookings for same slot
  const conflicting = await Booking.find({
    parkingSlot,
    status: 'confirmed',
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) },
  });
  if (conflicting.length > 0) {
    throw new ApiError(409, 'Conflict: Parking slot is already booked for this time range');
  }

  // 7. Calculations
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  const durationHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Ceil up to next hour

  let category = '';
  if (['bike', 'scooter'].includes(vehicleDoc.type)) {
    category = 'twoWheeler';
  } else if (['car', 'ev'].includes(vehicleDoc.type)) {
    category = 'fourWheeler';
  }

  let hourlyRateSnapshot = lotDoc.pricePerHour;
  if (
    category &&
    lotDoc.pricePerHourByVehicleCategory &&
    typeof lotDoc.pricePerHourByVehicleCategory[category] === 'number' &&
    lotDoc.pricePerHourByVehicleCategory[category] > 0
  ) {
    hourlyRateSnapshot = lotDoc.pricePerHourByVehicleCategory[category];
  }
  const totalAmount = durationHours * hourlyRateSnapshot;

  // 8. Generate booking reference PIN-[8-char hex]
  const bookingReference = `PIN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // 9. Revenue calculation
  const platformFee = Number((totalAmount * 0.1).toFixed(2));
  const ownerEarning = Number((totalAmount - platformFee).toFixed(2));
  const paymentStatus = 'paid';
  const payoutStatus = 'pending';

  // 10. Save
  const booking = await Booking.create({
    user: userId,
    parkingLot,
    parkingSlot,
    vehicle,
    bookingReference,
    startTime: start,
    endTime: end,
    durationHours,
    hourlyRateSnapshot,
    totalAmount,
    platformFee,
    ownerEarning,
    paymentStatus,
    payoutStatus,
    status: 'confirmed',
  });

  return res
    .status(201)
    .json(new ApiResponse(201, booking, 'Booking created successfully'));
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const bookings = await Booking.find({ user: userId })
    .populate('parkingLot')
    .populate('parkingSlot')
    .populate('vehicle')
    .sort({ startTime: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, 'Bookings retrieved successfully'));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  const booking = await Booking.findById(bookingId)
    .populate('user', 'name email')
    .populate('parkingLot')
    .populate('parkingSlot')
    .populate('vehicle');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (!isAdmin && booking.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, 'Forbidden: Access denied');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, 'Booking retrieved successfully'));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { cancellationReason } = req.body;
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (!isAdmin) {
    if (booking.user.toString() !== userId.toString()) {
      throw new ApiError(403, 'Forbidden: Access denied');
    }
    if (booking.status !== 'confirmed') {
      throw new ApiError(400, 'Only confirmed bookings can be cancelled');
    }
    if (new Date() >= new Date(booking.startTime)) {
      throw new ApiError(400, 'Cannot cancel booking after it has started');
    }
  } else {
    if (booking.status !== 'confirmed') {
      throw new ApiError(400, 'Only confirmed bookings can be cancelled');
    }
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBooking, 'Booking cancelled successfully'));
});

export const getAllBookings = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { status, parkingLotId, startDate, endDate } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }
  if (parkingLotId) {
    query.parkingLot = parkingLotId;
  }
  if (startDate || endDate) {
    query.startTime = {};
    if (startDate) {
      query.startTime.$gte = new Date(startDate);
    }
    if (endDate) {
      query.startTime.$lte = new Date(endDate);
    }
  }

  const bookings = await Booking.find(query)
    .populate('user', 'name email')
    .populate('parkingLot')
    .populate('parkingSlot')
    .populate('vehicle')
    .sort({ startTime: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, 'All bookings retrieved successfully'));
});

const crypto = require('crypto');
const bookingRepository = require('../repositories/booking.repository');
const vehicleRepository = require('../repositories/user.repository'); // Wait, let's verify where vehicleRepository is located
// Let's check vehicleRepository imports or import the models directly if needed
// Let's check what we need to import:
const Vehicle = require('../models/vehicle.model');
const ParkingLot = require('../models/parkingLot.model');
const ParkingSlot = require('../models/parkingSlot.model');
const ApiError = require('../utils/apiError');

class BookingService {
  /**
   * Create a new booking with validations.
   */
  async createBooking(userId, bookingData) {
    const { parkingLot, parkingSlot, vehicle, startTime, endTime } = bookingData;

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

    // 5. Reject slots with occupied or maintenance status
    if (['occupied', 'maintenance'].includes(slotDoc.status)) {
      throw new ApiError(400, `Selected parking slot is currently ${slotDoc.status}`);
    }

    // 6. Prevent overlapping bookings for same slot
    const conflicting = await bookingRepository.findConflictingBookings(parkingSlot, startTime, endTime);
    if (conflicting.length > 0) {
      throw new ApiError(409, 'Conflict: Parking slot is already booked for this time range');
    }

    // 7. Calculate calculations
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const durationHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Ceil up to next hour

    const hourlyRateSnapshot = lotDoc.pricePerHour;
    const totalAmount = durationHours * hourlyRateSnapshot;

    // 8. Generate booking reference PIN-[8-char hex]
    const bookingReference = `PIN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // 9. Save
    return await bookingRepository.create({
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
      status: 'confirmed',
    });
  }

  /**
   * Fetch all bookings for a specific user.
   */
  async getUserBookings(userId) {
    return await bookingRepository.findUserBookings(userId);
  }

  /**
   * Get single booking details. Verifies ownership/auth role.
   */
  async getBookingById(userId, bookingId, isAdmin) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (!isAdmin && booking.user._id.toString() !== userId.toString()) {
      throw new ApiError(403, 'Forbidden: Access denied');
    }

    return booking;
  }

  /**
   * Cancel booking. Applies timeline constraints for users and allows admins to override.
   */
  async cancelBooking(userId, bookingId, cancellationReason, isAdmin) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (!isAdmin) {
      if (booking.user._id.toString() !== userId.toString()) {
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

    return await bookingRepository.update(bookingId, {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancellationReason,
    });
  }

  /**
   * Fetch all bookings (Admin only).
   */
  async getAllBookings(filters) {
    return await bookingRepository.findAll(filters);
  }
}

module.exports = new BookingService();

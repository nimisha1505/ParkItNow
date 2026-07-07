const Booking = require('../models/booking.model');

class BookingRepository {
  async create(data) {
    return await Booking.create(data);
  }

  async findById(id) {
    return await Booking.findById(id)
      .populate('user', 'name email')
      .populate('parkingLot')
      .populate('parkingSlot')
      .populate('vehicle');
  }

  async findByReference(bookingReference) {
    return await Booking.findOne({ bookingReference: bookingReference.toUpperCase() })
      .populate('user', 'name email')
      .populate('parkingLot')
      .populate('parkingSlot')
      .populate('vehicle');
  }

  async findUserBookings(userId) {
    return await Booking.find({ user: userId })
      .populate('parkingLot')
      .populate('parkingSlot')
      .populate('vehicle')
      .sort({ startTime: -1 });
  }

  async findConflictingBookings(slotId, startTime, endTime) {
    // Standard interval overlap formula: start1 < end2 AND end1 > start2
    return await Booking.find({
      parkingSlot: slotId,
      status: 'confirmed',
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) },
    });
  }

  async findAll(filters) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.parkingLotId) {
      query.parkingLot = filters.parkingLotId;
    }
    if (filters.startDate || filters.endDate) {
      query.startTime = {};
      if (filters.startDate) {
        query.startTime.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.startTime.$lte = new Date(filters.endDate);
      }
    }

    return await Booking.find(query)
      .populate('user', 'name email')
      .populate('parkingLot')
      .populate('parkingSlot')
      .populate('vehicle')
      .sort({ startTime: -1 });
  }

  async update(id, updateData) {
    return await Booking.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new BookingRepository();

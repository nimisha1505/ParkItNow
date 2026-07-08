import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parkingLot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
      required: true,
    },
    parkingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSlot',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
    },
    hourlyRateSnapshot: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed', 'expired'],
      default: 'confirmed',
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    qrTokenHash: {
      type: String,
    },
    qrIssuedAt: {
      type: Date,
    },
    entryStatus: {
      type: String,
      enum: ['not_checked_in', 'checked_in', 'checked_out'],
      default: 'not_checked_in',
    },
    checkedInAt: {
      type: Date,
    },
    checkedOutAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

bookingSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.qrTokenHash;
    return ret;
  },
});

bookingSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.qrTokenHash;
    return ret;
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

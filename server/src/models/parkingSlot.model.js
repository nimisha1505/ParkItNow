import mongoose from 'mongoose';

const parkingSlotSchema = new mongoose.Schema(
  {
    parkingLot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
      required: [true, 'Parking lot reference is required'],
    },
    slotNumber: {
      type: String,
      required: [true, 'Slot number is required'],
      trim: true,
    },
    floor: {
      type: String,
      default: 'Ground',
      trim: true,
    },
    section: {
      type: String,
      default: 'A',
      trim: true,
    },
    supportedVehicleTypes: {
      type: [String],
      enum: ['car', 'bike', 'scooter', 'ev'],
      required: [true, 'Supported vehicle types are required'],
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'occupied', 'maintenance'],
      default: 'available',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Enforce unique slot number within the same parking lot
parkingSlotSchema.index({ parkingLot: 1, slotNumber: 1 }, { unique: true });

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
export default ParkingSlot;

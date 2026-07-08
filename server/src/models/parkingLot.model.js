import mongoose from 'mongoose';

const parkingLotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Parking lot name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      lowercase: true,
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      lowercase: true,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
    totalSlots: {
      type: Number,
      required: [true, 'Total slots is required'],
      min: [0, 'Total slots cannot be negative'],
    },
    availableSlots: {
      type: Number,
      required: [true, 'Available slots is required'],
      min: [0, 'Available slots cannot be negative'],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: [0, 'Price cannot be negative'],
    },
    supportedVehicleTypes: {
      type: [String],
      enum: ['car', 'bike', 'scooter', 'ev'],
      required: [true, 'Supported vehicle types are required'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const ParkingLot = mongoose.model('ParkingLot', parkingLotSchema);
export default ParkingLot;

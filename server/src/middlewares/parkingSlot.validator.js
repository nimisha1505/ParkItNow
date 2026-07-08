import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError.js';

const allowedTypes = ['car', 'bike', 'scooter', 'ev'];
const allowedStatuses = ['available', 'reserved', 'occupied', 'maintenance'];

export const validateCreateParkingSlot = (req, res, next) => {
  const { parkingLot, slotNumber, floor, section, supportedVehicleTypes, status } = req.body;
  const errors = [];

  if (!parkingLot || !mongoose.Types.ObjectId.isValid(parkingLot)) {
    errors.push('Valid parking lot ID is required');
  }

  if (!slotNumber || slotNumber.trim() === '') {
    errors.push('Slot number is required');
  }

  if (floor !== undefined && floor.trim() === '') {
    errors.push('Floor cannot be empty');
  }

  if (section !== undefined && section.trim() === '') {
    errors.push('Section cannot be empty');
  }

  if (!supportedVehicleTypes || !Array.isArray(supportedVehicleTypes) || supportedVehicleTypes.length === 0) {
    errors.push('supportedVehicleTypes must be a non-empty array');
  } else {
    const invalidTypes = supportedVehicleTypes.filter((t) => !allowedTypes.includes(t));
    if (invalidTypes.length > 0) {
      errors.push(`Invalid vehicle types: ${invalidTypes.join(', ')}. Allowed: ${allowedTypes.join(', ')}`);
    }
  }

  if (status !== undefined && !allowedStatuses.includes(status)) {
    errors.push(`Invalid status value. Allowed: ${allowedStatuses.join(', ')}`);
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

export const validateUpdateParkingSlot = (req, res, next) => {
  const { parkingLot, slotNumber, floor, section, supportedVehicleTypes, status } = req.body;
  const errors = [];

  if (parkingLot !== undefined && !mongoose.Types.ObjectId.isValid(parkingLot)) {
    errors.push('Valid parking lot ID is required');
  }

  if (slotNumber !== undefined && slotNumber.trim() === '') {
    errors.push('Slot number cannot be empty');
  }

  if (floor !== undefined && floor.trim() === '') {
    errors.push('Floor cannot be empty');
  }

  if (section !== undefined && section.trim() === '') {
    errors.push('Section cannot be empty');
  }

  if (supportedVehicleTypes !== undefined) {
    if (!Array.isArray(supportedVehicleTypes) || supportedVehicleTypes.length === 0) {
      errors.push('supportedVehicleTypes must be a non-empty array');
    } else {
      const invalidTypes = supportedVehicleTypes.filter((t) => !allowedTypes.includes(t));
      if (invalidTypes.length > 0) {
        errors.push(`Invalid vehicle types: ${invalidTypes.join(', ')}. Allowed: ${allowedTypes.join(', ')}`);
      }
    }
  }

  if (status !== undefined && !allowedStatuses.includes(status)) {
    errors.push(`Invalid status value. Allowed: ${allowedStatuses.join(', ')}`);
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

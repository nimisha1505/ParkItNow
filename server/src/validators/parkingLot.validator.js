const ApiError = require('../utils/apiError');

const allowedTypes = ['car', 'bike', 'scooter', 'ev'];

/**
 * Validate parking lot creation.
 */
const validateCreateParkingLot = (req, res, next) => {
  const {
    name,
    address,
    city,
    area,
    coordinates,
    totalSlots,
    availableSlots,
    pricePerHour,
    supportedVehicleTypes,
  } = req.body;

  const errors = [];

  if (!name || name.trim() === '') errors.push('Name is required');
  if (!address || address.trim() === '') errors.push('Address is required');
  if (!city || city.trim() === '') errors.push('City is required');
  if (!area || area.trim() === '') errors.push('Area is required');

  if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
    errors.push('Coordinates with valid lat and lng numbers are required');
  }

  if (totalSlots === undefined || typeof totalSlots !== 'number' || totalSlots < 0) {
    errors.push('Total slots must be a positive number');
  }

  if (availableSlots === undefined || typeof availableSlots !== 'number' || availableSlots < 0) {
    errors.push('Available slots must be a positive number');
  }

  if (pricePerHour === undefined || typeof pricePerHour !== 'number' || pricePerHour < 0) {
    errors.push('Price per hour must be a positive number');
  }

  if (!supportedVehicleTypes || !Array.isArray(supportedVehicleTypes) || supportedVehicleTypes.length === 0) {
    errors.push('supportedVehicleTypes must be a non-empty array');
  } else {
    const invalidTypes = supportedVehicleTypes.filter((t) => !allowedTypes.includes(t));
    if (invalidTypes.length > 0) {
      errors.push(`Invalid vehicle types: ${invalidTypes.join(', ')}. Allowed: ${allowedTypes.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

/**
 * Validate parking lot updates.
 */
const validateUpdateParkingLot = (req, res, next) => {
  const {
    name,
    address,
    city,
    area,
    coordinates,
    totalSlots,
    availableSlots,
    pricePerHour,
    supportedVehicleTypes,
  } = req.body;

  const errors = [];

  if (name !== undefined && name.trim() === '') errors.push('Name cannot be empty');
  if (address !== undefined && address.trim() === '') errors.push('Address cannot be empty');
  if (city !== undefined && city.trim() === '') errors.push('City cannot be empty');
  if (area !== undefined && area.trim() === '') errors.push('Area cannot be empty');

  if (coordinates !== undefined && (typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number')) {
    errors.push('Coordinates must include valid lat and lng numbers');
  }

  if (totalSlots !== undefined && (typeof totalSlots !== 'number' || totalSlots < 0)) {
    errors.push('Total slots must be a positive number');
  }

  if (availableSlots !== undefined && (typeof availableSlots !== 'number' || availableSlots < 0)) {
    errors.push('Available slots must be a positive number');
  }

  if (pricePerHour !== undefined && (typeof pricePerHour !== 'number' || pricePerHour < 0)) {
    errors.push('Price per hour must be a positive number');
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

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = {
  validateCreateParkingLot,
  validateUpdateParkingLot,
};

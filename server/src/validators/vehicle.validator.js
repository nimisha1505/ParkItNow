const ApiError = require('../utils/apiError');

const allowedTypes = ['car', 'bike', 'scooter', 'ev'];

/**
 * Validator middleware for creating a vehicle.
 */
const validateCreateVehicle = (req, res, next) => {
  const { type, brand, model, registrationNumber, color, isDefault } = req.body;
  const errors = [];

  if (!type || !allowedTypes.includes(type)) {
    errors.push(`Vehicle type must be one of: ${allowedTypes.join(', ')}`);
  }

  if (!brand || brand.trim() === '') {
    errors.push('Brand is required');
  }

  if (!model || model.trim() === '') {
    errors.push('Model is required');
  }

  if (!registrationNumber || registrationNumber.trim() === '') {
    errors.push('Registration number is required');
  }

  if (!color || color.trim() === '') {
    errors.push('Color is required');
  }

  if (isDefault !== undefined && typeof isDefault !== 'boolean') {
    errors.push('isDefault must be a boolean');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

/**
 * Validator middleware for updating a vehicle.
 */
const validateUpdateVehicle = (req, res, next) => {
  const { type, brand, model, registrationNumber, color, isDefault } = req.body;
  const errors = [];

  if (type !== undefined && !allowedTypes.includes(type)) {
    errors.push(`Vehicle type must be one of: ${allowedTypes.join(', ')}`);
  }

  if (brand !== undefined && brand.trim() === '') {
    errors.push('Brand cannot be empty');
  }

  if (model !== undefined && model.trim() === '') {
    errors.push('Model cannot be empty');
  }

  if (registrationNumber !== undefined && registrationNumber.trim() === '') {
    errors.push('Registration number cannot be empty');
  }

  if (color !== undefined && color.trim() === '') {
    errors.push('Color cannot be empty');
  }

  if (isDefault !== undefined && typeof isDefault !== 'boolean') {
    errors.push('isDefault must be a boolean');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = {
  validateCreateVehicle,
  validateUpdateVehicle,
};

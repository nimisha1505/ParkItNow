const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

/**
 * Validate booking creation request payload.
 */
const validateCreateBooking = (req, res, next) => {
  const { parkingLot, parkingSlot, vehicle, startTime, endTime } = req.body;
  const errors = [];

  if (!parkingLot || !mongoose.Types.ObjectId.isValid(parkingLot)) {
    errors.push('Valid parkingLot ID is required');
  }

  if (!parkingSlot || !mongoose.Types.ObjectId.isValid(parkingSlot)) {
    errors.push('Valid parkingSlot ID is required');
  }

  if (!vehicle || !mongoose.Types.ObjectId.isValid(vehicle)) {
    errors.push('Valid vehicle ID is required');
  }

  if (!startTime || isNaN(Date.parse(startTime))) {
    errors.push('Valid startTime date string is required');
  } else if (new Date(startTime) <= new Date()) {
    errors.push('startTime must be in the future');
  }

  if (!endTime || isNaN(Date.parse(endTime))) {
    errors.push('Valid endTime date string is required');
  }

  if (startTime && endTime && Date.parse(startTime) && Date.parse(endTime)) {
    if (new Date(endTime) <= new Date(startTime)) {
      errors.push('endTime must be after startTime');
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

/**
 * Validate booking cancel request payload.
 */
const validateCancelBooking = (req, res, next) => {
  const { cancellationReason } = req.body;
  const errors = [];

  if (!cancellationReason || cancellationReason.trim() === '') {
    errors.push('Cancellation reason is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = {
  validateCreateBooking,
  validateCancelBooking,
};

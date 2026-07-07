const ApiError = require('../utils/apiError');

/**
 * Validates request payload for registration.
 */
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

/**
 * Validates request payload for login.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};

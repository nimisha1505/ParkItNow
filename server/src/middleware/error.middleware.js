const ApiError = require('../utils/apiError');

/**
 * Centralized error handler middleware.
 * Formats uncaught errors into clean, uniform API response payloads.
 */
const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of our custom ApiError, standardize it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    // Expose stack trace only during development mode
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
  };

  return res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const userRepository = require('../repositories/user.repository');

/**
 * Authentication middleware that verifies JWT Access Tokens from cookies or headers.
 * Populates req.user with the active User model if valid.
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request: Access token is missing');
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'access-secret'
    );

    const user = await userRepository.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

module.exports = { verifyJWT };

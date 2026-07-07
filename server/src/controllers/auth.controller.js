const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Cookie options for token storage
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

/**
 * Register controller.
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const { user, accessToken, refreshToken } = await authService.register({
    name,
    email,
    password,
    role,
  });

  return res
    .status(201)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user, accessToken, refreshToken },
        'User registered successfully'
      )
    );
});

/**
 * Login controller.
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.login({
    email,
    password,
  });

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        'User logged in successfully'
      )
    );
});

/**
 * Logout controller.
 */
const logoutUser = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

/**
 * Refresh token controller.
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken } = await authService.refreshAccessToken(
    incomingRefreshToken
  );

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        'Access token refreshed successfully'
      )
    );
});

/**
 * Get current authenticated user controller.
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Current user retrieved successfully'));
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};

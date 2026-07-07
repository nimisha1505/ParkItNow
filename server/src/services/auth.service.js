const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');

class AuthService {
  /**
   * Helper to generate access and refresh tokens, storing the latter in DB.
   */
  async generateAccessAndRefreshTokens(user) {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await userRepository.save(user);

    return { accessToken, refreshToken };
  }

  /**
   * Register a new user.
   */
  async register({ name, email, password, role }) {
    const existedUser = await userRepository.findByEmail(email);
    if (existedUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user);

    const createdUser = user.toObject();
    delete createdUser.password;
    delete createdUser.refreshToken;

    return { user: createdUser, accessToken, refreshToken };
  }

  /**
   * Login user by validating email and password.
   */
  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid user credentials');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid user credentials');
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user);

    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    return { user: loggedInUser, accessToken, refreshToken };
  }

  /**
   * Logout user by clearing the stored refresh token.
   */
  async logout(userId) {
    await userRepository.clearRefreshToken(userId);
  }

  /**
   * Verify and refresh the current user's session token.
   */
  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Refresh token is required');
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'refresh-secret'
      );

      const user = await userRepository.findById(decodedToken._id);
      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, 'Refresh token is invalid or expired');
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.generateAccessAndRefreshTokens(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ApiError(401, error?.message || 'Invalid refresh token');
    }
  }

  /**
   * Get user data by ID.
   */
  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return userObj;
  }
}

module.exports = new AuthService();

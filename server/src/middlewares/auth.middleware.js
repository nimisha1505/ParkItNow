import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
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

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

export const isOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    throw new ApiError(403, 'Forbidden: Owner access required');
  }
  next();
};

export const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'superAdmin') {
    throw new ApiError(403, 'Forbidden: SuperAdmin access required');
  }
  next();
};

export const isOwnerOrSuperAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'owner' && req.user.role !== 'superAdmin')) {
    throw new ApiError(403, 'Forbidden: Owner or SuperAdmin access required');
  }
  next();
};

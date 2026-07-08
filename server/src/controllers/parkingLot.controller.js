import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ParkingLot from '../models/parkingLot.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getIsAdmin = async (req) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return false;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access-secret');
    const user = await User.findById(decoded._id);
    return user && user.role === 'admin';
  } catch (error) {
    return false;
  }
};

export const createParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const parkingLot = await ParkingLot.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, parkingLot, 'Parking lot created successfully'));
});

export const getParkingLots = asyncHandler(async (req, res) => {
  const { city, area, vehicleType, minPrice, maxPrice } = req.query;
  const isAdmin = await getIsAdmin(req);

  const query = {};
  if (city) {
    query.city = city.toLowerCase();
  }
  if (area) {
    query.area = area.toLowerCase();
  }
  if (vehicleType) {
    query.supportedVehicleTypes = vehicleType;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.pricePerHour = {};
    if (minPrice !== undefined) {
      query.pricePerHour.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      query.pricePerHour.$lte = Number(maxPrice);
    }
  }
  if (!isAdmin) {
    query.isActive = true;
  }

  const parkingLots = await ParkingLot.find(query);

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLots, 'Parking lots retrieved successfully'));
});

export const getParkingLotById = asyncHandler(async (req, res) => {
  const { parkingLotId } = req.params;
  const isAdmin = await getIsAdmin(req);

  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (!parkingLot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  if (!isAdmin && !parkingLot.isActive) {
    throw new ApiError(404, 'Parking lot not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot retrieved successfully'));
});

export const updateParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { parkingLotId } = req.params;
  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (!parkingLot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  const updatedParkingLot = await ParkingLot.findByIdAndUpdate(
    parkingLotId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedParkingLot, 'Parking lot updated successfully'));
});

export const deleteParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { parkingLotId } = req.params;
  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (!parkingLot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  await ParkingLot.findByIdAndDelete(parkingLotId);

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot deleted successfully'));
});

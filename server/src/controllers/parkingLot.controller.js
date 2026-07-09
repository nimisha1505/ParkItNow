import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ParkingLot from '../models/parkingLot.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'owner' && req.user.role !== 'superAdmin') {
    throw new ApiError(403, 'Forbidden: Owner or SuperAdmin access required');
  }

  const isOwner = req.user.role === 'owner';

  const parkingLotData = {
    ...req.body,
    createdBy: req.user._id,
    owner: isOwner ? req.user._id : (req.body.owner || req.user._id),
  };

  if (isOwner) {
    parkingLotData.approvalStatus = 'pending';
    parkingLotData.isActive = false;
  }

  const parkingLot = await ParkingLot.create(parkingLotData);

  return res
    .status(201)
    .json(new ApiResponse(201, parkingLot, 'Parking lot created successfully'));
});

export const getParkingLots = asyncHandler(async (req, res) => {
  const { city, area, vehicleType, minPrice, maxPrice, approvalStatus, myLots } = req.query;

  let currentUser = null;
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access-secret');
      currentUser = await User.findById(decoded._id);
    }
  } catch (error) {
    // Ignore invalid/missing token for public list route
  }

  const query = {};
  if (city) {
    query.city = { $regex: `^${city.trim()}$`, $options: 'i' };
  }
  if (area) {
    query.area = { $regex: `^${area.trim()}$`, $options: 'i' };
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

  if (myLots === 'true' && currentUser) {
    query.owner = currentUser._id;
  } else if (approvalStatus === 'pending' && currentUser?.role === 'superAdmin') {
    query.approvalStatus = 'pending';
  } else {
    query.approvalStatus = 'approved';
    query.isActive = true;
  }

  const parkingLots = await ParkingLot.find(query);

  console.log("req.query:", req.query);
  console.log("final MongoDB filter:", query);
  console.log("result count:", parkingLots.length);

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLots, 'Parking lots retrieved successfully'));
});

export const getParkingLotById = asyncHandler(async (req, res) => {
  const { parkingLotId } = req.params;

  let currentUser = null;
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access-secret');
      currentUser = await User.findById(decoded._id);
    }
  } catch (error) {
    // Ignore invalid/missing token
  }

  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (!parkingLot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  if (!currentUser || currentUser.role !== 'superAdmin') {
    const isOwnerOfLot = currentUser && parkingLot.owner && parkingLot.owner.toString() === currentUser._id.toString();
    if (!isOwnerOfLot && (parkingLot.approvalStatus !== 'approved' || !parkingLot.isActive)) {
      throw new ApiError(404, 'Parking lot not found');
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot retrieved successfully'));
});

export const updateParkingLot = asyncHandler(async (req, res) => {
  const { parkingLotId } = req.params;
  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (!parkingLot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwnerOfLot = parkingLot.owner && parkingLot.owner.toString() === req.user._id.toString();

  if (!isSuperAdmin && (!isOwnerOfLot || req.user.role !== 'owner')) {
    throw new ApiError(403, 'Forbidden: You do not have permission to update this parking lot');
  }

  const updateData = { ...req.body };
  if (req.user.role === 'owner') {
    delete updateData.approvalStatus;
    delete updateData.owner;
    delete updateData.createdBy;
  }

  const updatedParkingLot = await ParkingLot.findByIdAndUpdate(
    parkingLotId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedParkingLot, 'Parking lot updated successfully'));
});

export const deleteParkingLot = asyncHandler(async (req, res) => {
  const { parkingLotId } = req.params;
  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (!parkingLot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwnerOfLot = parkingLot.owner && parkingLot.owner.toString() === req.user._id.toString();

  if (!isSuperAdmin && (!isOwnerOfLot || req.user.role !== 'owner')) {
    throw new ApiError(403, 'Forbidden: You do not have permission to delete this parking lot');
  }

  await ParkingLot.findByIdAndDelete(parkingLotId);

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot deleted successfully'));
});

export const approveParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'superAdmin') {
    throw new ApiError(403, 'Forbidden: SuperAdmin access required');
  }

  const { parkingLotId } = req.params;
  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (!parkingLot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  if (parkingLot.owner && parkingLot.owner.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'Bad Request: You cannot approve your own parking lot');
  }

  parkingLot.approvalStatus = 'approved';
  parkingLot.isActive = true;
  await parkingLot.save();

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot approved successfully'));
});

export const rejectParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'superAdmin') {
    throw new ApiError(403, 'Forbidden: SuperAdmin access required');
  }

  const { parkingLotId } = req.params;
  const parkingLot = await ParkingLot.findById(parkingLotId);
  if (!parkingLot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  if (parkingLot.owner && parkingLot.owner.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'Bad Request: You cannot modify approval status of your own parking lot');
  }

  parkingLot.approvalStatus = 'rejected';
  parkingLot.isActive = false;
  await parkingLot.save();

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot rejected successfully'));
});

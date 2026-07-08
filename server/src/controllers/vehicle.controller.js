import Vehicle from '../models/vehicle.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createVehicle = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type, brand, model, registrationNumber, color, isDefault } = req.body;

  const existingVehicle = await Vehicle.findOne({
    registrationNumber: registrationNumber.toUpperCase(),
  });
  if (existingVehicle) {
    throw new ApiError(409, `Vehicle with registration number ${registrationNumber} already exists`);
  }

  const userVehicles = await Vehicle.find({ owner: userId });
  const isFirstVehicle = userVehicles.length === 0;
  const shouldBeDefault = isDefault || isFirstVehicle;

  if (shouldBeDefault) {
    await Vehicle.updateMany(
      { owner: userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  const vehicle = await Vehicle.create({
    owner: userId,
    type,
    brand,
    model,
    registrationNumber: registrationNumber.toUpperCase(),
    color,
    isDefault: shouldBeDefault,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, vehicle, 'Vehicle registered successfully'));
});

export const getVehicles = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const vehicles = await Vehicle.find({ owner: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, vehicles, 'Vehicles retrieved successfully'));
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { vehicleId } = req.params;

  const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId });
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, vehicle, 'Vehicle retrieved successfully'));
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { vehicleId } = req.params;
  const updateData = { ...req.body };

  const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId });
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  if (updateData.registrationNumber && updateData.registrationNumber.toUpperCase() !== vehicle.registrationNumber) {
    const existingVehicle = await Vehicle.findOne({
      registrationNumber: updateData.registrationNumber.toUpperCase(),
    });
    if (existingVehicle) {
      throw new ApiError(409, `Vehicle with registration number ${updateData.registrationNumber} already exists`);
    }
    updateData.registrationNumber = updateData.registrationNumber.toUpperCase();
  }

  if (updateData.isDefault === true) {
    await Vehicle.updateMany(
      { owner: userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  } else if (updateData.isDefault === false && vehicle.isDefault) {
    const userVehicles = await Vehicle.find({ owner: userId });
    if (userVehicles.length > 1) {
      const otherVehicle = userVehicles.find((v) => v._id.toString() !== vehicleId);
      if (otherVehicle) {
        otherVehicle.isDefault = true;
        await otherVehicle.save();
      }
    } else {
      updateData.isDefault = true;
    }
  }

  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, owner: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVehicle, 'Vehicle updated successfully'));
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { vehicleId } = req.params;

  const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId });
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  const wasDefault = vehicle.isDefault;
  await Vehicle.findOneAndDelete({ _id: vehicleId, owner: userId });

  if (wasDefault) {
    const userVehicles = await Vehicle.find({ owner: userId });
    if (userVehicles.length > 0) {
      userVehicles[0].isDefault = true;
      await userVehicles[0].save();
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, vehicle, 'Vehicle deleted successfully'));
});

export const setDefaultVehicle = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { vehicleId } = req.params;

  const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId });
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  await Vehicle.updateMany(
    { owner: userId, isDefault: true },
    { $set: { isDefault: false } }
  );

  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, owner: userId },
    { $set: { isDefault: true } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVehicle, 'Default vehicle updated successfully'));
});

const vehicleService = require('../services/vehicle.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Controller for registering a new vehicle.
 */
const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.user._id, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, vehicle, 'Vehicle registered successfully'));
});

/**
 * Controller for retrieving all vehicles for the authenticated user.
 */
const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getVehicles(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, vehicles, 'Vehicles retrieved successfully'));
});

/**
 * Controller for retrieving a single vehicle by ID.
 */
const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.user._id, req.params.vehicleId);
  return res
    .status(200)
    .json(new ApiResponse(200, vehicle, 'Vehicle retrieved successfully'));
});

/**
 * Controller for updating vehicle details.
 */
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(
    req.user._id,
    req.params.vehicleId,
    req.body
  );
  return res
    .status(200)
    .json(new ApiResponse(200, vehicle, 'Vehicle updated successfully'));
});

/**
 * Controller for deleting a vehicle.
 */
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.deleteVehicle(req.user._id, req.params.vehicleId);
  return res
    .status(200)
    .json(new ApiResponse(200, vehicle, 'Vehicle deleted successfully'));
});

/**
 * Controller for setting a vehicle as the default vehicle.
 */
const setDefaultVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.setDefaultVehicle(req.user._id, req.params.vehicleId);
  return res
    .status(200)
    .json(new ApiResponse(200, vehicle, 'Default vehicle updated successfully'));
});

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  setDefaultVehicle,
};

const parkingSlotService = require('../services/parkingSlot.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

/**
 * Checks if the request contains credentials of an admin user.
 */
const getIsAdmin = async (req) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return false;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access-secret');
    const user = await userRepository.findById(decoded._id);
    return user && user.role === 'admin';
  } catch (error) {
    return false;
  }
};

/**
 * Controller to create a parking slot (Admin only).
 */
const createParkingSlot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const slot = await parkingSlotService.createParkingSlot(req.user._id, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, slot, 'Parking slot created successfully'));
});

/**
 * Controller to retrieve all parking slots.
 */
const getParkingSlots = asyncHandler(async (req, res) => {
  const { parkingLotId, vehicleType, floor, section, status } = req.query;
  const isAdmin = await getIsAdmin(req);

  const slots = await parkingSlotService.getParkingSlots(
    { parkingLotId, vehicleType, floor, section, status },
    isAdmin
  );

  return res
    .status(200)
    .json(new ApiResponse(200, slots, 'Parking slots retrieved successfully'));
});

/**
 * Controller to retrieve a single parking slot.
 */
const getParkingSlotById = asyncHandler(async (req, res) => {
  const { slotId } = req.params;
  const isAdmin = await getIsAdmin(req);

  const slot = await parkingSlotService.getParkingSlotById(slotId, isAdmin);
  return res
    .status(200)
    .json(new ApiResponse(200, slot, 'Parking slot retrieved successfully'));
});

/**
 * Controller to update a parking slot (Admin only).
 */
const updateParkingSlot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { slotId } = req.params;
  const slot = await parkingSlotService.updateParkingSlot(slotId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, slot, 'Parking slot updated successfully'));
});

/**
 * Controller to delete a parking slot (Admin only).
 */
const deleteParkingSlot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { slotId } = req.params;
  const slot = await parkingSlotService.deleteParkingSlot(slotId);

  return res
    .status(200)
    .json(new ApiResponse(200, slot, 'Parking slot deleted successfully'));
});

module.exports = {
  createParkingSlot,
  getParkingSlots,
  getParkingSlotById,
  updateParkingSlot,
  deleteParkingSlot,
};

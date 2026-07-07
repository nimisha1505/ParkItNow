const parkingLotService = require('../services/parkingLot.service');
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
 * Controller to create a parking lot.
 */
const createParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const parkingLot = await parkingLotService.createParkingLot(req.user._id, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, parkingLot, 'Parking lot created successfully'));
});

/**
 * Controller to retrieve all parking lots.
 */
const getParkingLots = asyncHandler(async (req, res) => {
  const { city, area, vehicleType, minPrice, maxPrice } = req.query;
  const isAdmin = await getIsAdmin(req);

  const parkingLots = await parkingLotService.getParkingLots(
    { city, area, vehicleType, minPrice, maxPrice },
    isAdmin
  );

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLots, 'Parking lots retrieved successfully'));
});

/**
 * Controller to retrieve a single parking lot.
 */
const getParkingLotById = asyncHandler(async (req, res) => {
  const { parkingLotId } = req.params;
  const isAdmin = await getIsAdmin(req);

  const parkingLot = await parkingLotService.getParkingLotById(parkingLotId, isAdmin);
  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot retrieved successfully'));
});

/**
 * Controller to update a parking lot.
 */
const updateParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { parkingLotId } = req.params;
  const parkingLot = await parkingLotService.updateParkingLot(parkingLotId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot updated successfully'));
});

/**
 * Controller to delete a parking lot.
 */
const deleteParkingLot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  const { parkingLotId } = req.params;
  const parkingLot = await parkingLotService.deleteParkingLot(parkingLotId);

  return res
    .status(200)
    .json(new ApiResponse(200, parkingLot, 'Parking lot deleted successfully'));
});

module.exports = {
  createParkingLot,
  getParkingLots,
  getParkingLotById,
  updateParkingLot,
  deleteParkingLot,
};

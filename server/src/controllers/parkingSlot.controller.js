import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ParkingSlot from '../models/parkingSlot.model.js';
import ParkingLot from '../models/parkingLot.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const syncParkingLotSlots = async (parkingLotId) => {
  const totalSlots = await ParkingSlot.countDocuments({ parkingLot: parkingLotId });
  const availableSlots = await ParkingSlot.countDocuments({ parkingLot: parkingLotId, status: 'available' });
  await ParkingLot.findByIdAndUpdate(parkingLotId, { $set: { totalSlots, availableSlots } });
};

export const createParkingSlot = asyncHandler(async (req, res) => {
  const { parkingLot, slotNumber } = req.body;

  const lot = await ParkingLot.findById(parkingLot);
  if (!lot) {
    throw new ApiError(404, 'Parking lot not found');
  }

  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwner = req.user.role === 'owner' && lot.owner && lot.owner.toString() === req.user._id.toString();

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: You do not have permission to manage slots for this parking lot');
  }

  const existingSlot = await ParkingSlot.findOne({ parkingLot, slotNumber });
  if (existingSlot) {
    throw new ApiError(409, `Slot number ${slotNumber} already exists in this parking lot`);
  }

  const newSlot = await ParkingSlot.create({
    ...req.body,
    createdBy: req.user._id,
  });

  await syncParkingLotSlots(parkingLot);

  return res
    .status(201)
    .json(new ApiResponse(201, newSlot, 'Parking slot created successfully'));
});

export const getParkingSlots = asyncHandler(async (req, res) => {
  const { parkingLotId, vehicleType, floor, section, status } = req.query;

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

  const query = {};

  if (parkingLotId) {
    const lot = await ParkingLot.findById(parkingLotId);
    if (!lot) {
      throw new ApiError(404, 'Parking lot not found');
    }

    const isSuperAdmin = currentUser?.role === 'superAdmin';
    const isOwner = currentUser?.role === 'owner' && lot.owner && lot.owner.toString() === currentUser._id.toString();

    if (!isSuperAdmin && !isOwner) {
      if (lot.approvalStatus !== 'approved' || !lot.isActive) {
        return res
          .status(200)
          .json(new ApiResponse(200, [], 'Parking slots retrieved successfully'));
      }
      if (status) {
        query.status = status;
      }
    } else {
      if (status) {
        query.status = status;
      }
    }
    query.parkingLot = parkingLotId;
  } else {
    const isSuperAdmin = currentUser?.role === 'superAdmin';
    if (!isSuperAdmin) {
      const activeLots = await ParkingLot.find({ approvalStatus: 'approved', isActive: true }).select('_id');
      const activeLotIds = activeLots.map((l) => l._id);
      query.parkingLot = { $in: activeLotIds };
      if (status) {
        query.status = status;
      }
    } else {
      if (status) {
        query.status = status;
      }
    }
  }

  if (vehicleType) {
    query.supportedVehicleTypes = vehicleType;
  }
  if (floor) {
    query.floor = floor;
  }
  if (section) {
    query.section = section;
  }

  const slots = await ParkingSlot.find(query).populate('parkingLot');

  return res
    .status(200)
    .json(new ApiResponse(200, slots, 'Parking slots retrieved successfully'));
});

export const getParkingSlotById = asyncHandler(async (req, res) => {
  const { slotId } = req.params;

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

  const slot = await ParkingSlot.findById(slotId).populate('parkingLot');
  if (!slot) {
    throw new ApiError(404, 'Parking slot not found');
  }

  const isSuperAdmin = currentUser?.role === 'superAdmin';
  const isOwner = currentUser?.role === 'owner' && slot.parkingLot && slot.parkingLot.owner && slot.parkingLot.owner.toString() === currentUser._id.toString();

  if (!isSuperAdmin && !isOwner) {
    if (!slot.parkingLot || slot.parkingLot.approvalStatus !== 'approved' || !slot.parkingLot.isActive) {
      throw new ApiError(404, 'Parking slot not found');
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, slot, 'Parking slot retrieved successfully'));
});

export const updateParkingSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params;
  const slot = await ParkingSlot.findById(slotId);
  if (!slot) {
    throw new ApiError(404, 'Parking slot not found');
  }

  const lot = await ParkingLot.findById(slot.parkingLot);
  if (!lot) {
    throw new ApiError(404, 'Associated parking lot not found');
  }

  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwner = req.user.role === 'owner' && lot.owner && lot.owner.toString() === req.user._id.toString();

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: You do not have permission to manage slots for this parking lot');
  }

  const { slotNumber, parkingLot } = req.body;
  const targetLotId = parkingLot || slot.parkingLot;

  if (
    (slotNumber && slotNumber !== slot.slotNumber) ||
    (parkingLot && parkingLot.toString() !== slot.parkingLot.toString())
  ) {
    const existingSlot = await ParkingSlot.findOne({
      parkingLot: targetLotId,
      slotNumber: slotNumber || slot.slotNumber,
    });
    if (existingSlot) {
      throw new ApiError(
        409,
        `Slot number ${slotNumber || slot.slotNumber} already exists in target lot`
      );
    }
  }

  const updatedSlot = await ParkingSlot.findByIdAndUpdate(
    slotId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  await syncParkingLotSlots(slot.parkingLot);

  if (parkingLot && parkingLot.toString() !== slot.parkingLot.toString()) {
    await syncParkingLotSlots(parkingLot);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSlot, 'Parking slot updated successfully'));
});

export const deleteParkingSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params;
  const slot = await ParkingSlot.findById(slotId);
  if (!slot) {
    throw new ApiError(404, 'Parking slot not found');
  }

  const lot = await ParkingLot.findById(slot.parkingLot);
  if (!lot) {
    throw new ApiError(404, 'Associated parking lot not found');
  }

  const isSuperAdmin = req.user.role === 'superAdmin';
  const isOwner = req.user.role === 'owner' && lot.owner && lot.owner.toString() === req.user._id.toString();

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: You do not have permission to manage slots for this parking lot');
  }

  await ParkingSlot.findByIdAndDelete(slotId);
  await syncParkingLotSlots(slot.parkingLot);

  return res
    .status(200)
    .json(new ApiResponse(200, slot, 'Parking slot deleted successfully'));
});

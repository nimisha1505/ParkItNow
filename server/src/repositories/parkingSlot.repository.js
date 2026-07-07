const ParkingSlot = require('../models/parkingSlot.model');
const ParkingLot = require('../models/parkingLot.model');

class ParkingSlotRepository {
  async create(data) {
    return await ParkingSlot.create(data);
  }

  async findById(id) {
    return await ParkingSlot.findById(id).populate('parkingLot');
  }

  async update(id, updateData) {
    return await ParkingSlot.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await ParkingSlot.findByIdAndDelete(id);
  }

  async findByLotAndSlotNumber(parkingLotId, slotNumber) {
    return await ParkingSlot.findOne({ parkingLot: parkingLotId, slotNumber });
  }

  async countSlots(parkingLotId) {
    const totalSlots = await ParkingSlot.countDocuments({ parkingLot: parkingLotId });
    const availableSlots = await ParkingSlot.countDocuments({ parkingLot: parkingLotId, status: 'available' });
    return { totalSlots, availableSlots };
  }

  async findAll(filters, restrictToActiveLots = false) {
    const query = {};

    if (restrictToActiveLots) {
      const activeLots = await ParkingLot.find({ isActive: true }).select('_id');
      const activeLotIds = activeLots.map((l) => l._id.toString());

      if (filters.parkingLotId) {
        if (activeLotIds.includes(filters.parkingLotId)) {
          query.parkingLot = filters.parkingLotId;
        } else {
          return [];
        }
      } else {
        query.parkingLot = { $in: activeLots.map((l) => l._id) };
      }
    } else if (filters.parkingLotId) {
      query.parkingLot = filters.parkingLotId;
    }

    if (filters.vehicleType) {
      query.supportedVehicleTypes = filters.vehicleType;
    }
    if (filters.floor) {
      query.floor = filters.floor;
    }
    if (filters.section) {
      query.section = filters.section;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    return await ParkingSlot.find(query).populate('parkingLot');
  }
}

module.exports = new ParkingSlotRepository();

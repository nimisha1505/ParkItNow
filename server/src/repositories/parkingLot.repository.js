const ParkingLot = require('../models/parkingLot.model');

class ParkingLotRepository {
  async create(data) {
    return await ParkingLot.create(data);
  }

  async findById(id) {
    return await ParkingLot.findById(id);
  }

  async update(id, updateData) {
    return await ParkingLot.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await ParkingLot.findByIdAndDelete(id);
  }

  async findAll(filters) {
    const query = {};

    if (filters.city) {
      query.city = filters.city.toLowerCase();
    }
    if (filters.area) {
      query.area = filters.area.toLowerCase();
    }
    if (filters.vehicleType) {
      query.supportedVehicleTypes = filters.vehicleType;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.pricePerHour = {};
      if (filters.minPrice !== undefined) {
        query.pricePerHour.$gte = Number(filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query.pricePerHour.$lte = Number(filters.maxPrice);
      }
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    return await ParkingLot.find(query);
  }
}

module.exports = new ParkingLotRepository();

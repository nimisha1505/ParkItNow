const Vehicle = require('../models/vehicle.model');

class VehicleRepository {
  async findByRegistrationNumber(registrationNumber) {
    return await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase() });
  }

  async findUserVehicles(userId) {
    return await Vehicle.find({ owner: userId });
  }

  async findUserVehicleById(userId, vehicleId) {
    return await Vehicle.findOne({ _id: vehicleId, owner: userId });
  }

  async create(vehicleData) {
    return await Vehicle.create(vehicleData);
  }

  async update(userId, vehicleId, updateData) {
    return await Vehicle.findOneAndUpdate(
      { _id: vehicleId, owner: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async delete(userId, vehicleId) {
    return await Vehicle.findOneAndDelete({ _id: vehicleId, owner: userId });
  }

  async clearUserDefaultVehicles(userId) {
    return await Vehicle.updateMany(
      { owner: userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  async setDefaultVehicle(userId, vehicleId) {
    await this.clearUserDefaultVehicles(userId);
    return await Vehicle.findOneAndUpdate(
      { _id: vehicleId, owner: userId },
      { $set: { isDefault: true } },
      { new: true }
    );
  }
}

module.exports = new VehicleRepository();

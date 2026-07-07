const vehicleRepository = require('../repositories/vehicle.repository');
const ApiError = require('../utils/apiError');

class VehicleService {
  /**
   * Create a new vehicle. Auto-sets default if first vehicle.
   */
  async createVehicle(userId, vehicleData) {
    const { type, brand, model, registrationNumber, color, isDefault } = vehicleData;

    const existingVehicle = await vehicleRepository.findByRegistrationNumber(registrationNumber);
    if (existingVehicle) {
      throw new ApiError(409, `Vehicle with registration number ${registrationNumber} already exists`);
    }

    const userVehicles = await vehicleRepository.findUserVehicles(userId);
    const isFirstVehicle = userVehicles.length === 0;

    let shouldBeDefault = isDefault || isFirstVehicle;

    if (shouldBeDefault) {
      await vehicleRepository.clearUserDefaultVehicles(userId);
    }

    return await vehicleRepository.create({
      owner: userId,
      type,
      brand,
      model,
      registrationNumber: registrationNumber.toUpperCase(),
      color,
      isDefault: shouldBeDefault,
    });
  }

  /**
   * Fetch all vehicles owned by user.
   */
  async getVehicles(userId) {
    return await vehicleRepository.findUserVehicles(userId);
  }

  /**
   * Fetch a single vehicle. Validates owner.
   */
  async getVehicleById(userId, vehicleId) {
    const vehicle = await vehicleRepository.findUserVehicleById(userId, vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }
    return vehicle;
  }

  /**
   * Update vehicle details. Handles uniqueness check and default toggling.
   */
  async updateVehicle(userId, vehicleId, updateData) {
    const { registrationNumber, isDefault } = updateData;

    const vehicle = await vehicleRepository.findUserVehicleById(userId, vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    if (registrationNumber && registrationNumber.toUpperCase() !== vehicle.registrationNumber) {
      const existingVehicle = await vehicleRepository.findByRegistrationNumber(registrationNumber);
      if (existingVehicle) {
        throw new ApiError(409, `Vehicle with registration number ${registrationNumber} already exists`);
      }
      updateData.registrationNumber = registrationNumber.toUpperCase();
    }

    if (isDefault === true) {
      await vehicleRepository.clearUserDefaultVehicles(userId);
    } else if (isDefault === false && vehicle.isDefault) {
      const userVehicles = await vehicleRepository.findUserVehicles(userId);
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

    return await vehicleRepository.update(userId, vehicleId, updateData);
  }

  /**
   * Delete vehicle. Promotes another vehicle to default if deleted vehicle was default.
   */
  async deleteVehicle(userId, vehicleId) {
    const vehicle = await vehicleRepository.findUserVehicleById(userId, vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    const wasDefault = vehicle.isDefault;
    await vehicleRepository.delete(userId, vehicleId);

    if (wasDefault) {
      const userVehicles = await vehicleRepository.findUserVehicles(userId);
      if (userVehicles.length > 0) {
        userVehicles[0].isDefault = true;
        await userVehicles[0].save();
      }
    }

    return vehicle;
  }

  /**
   * Set vehicle as default, clearing other defaults.
   */
  async setDefaultVehicle(userId, vehicleId) {
    const vehicle = await vehicleRepository.findUserVehicleById(userId, vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    return await vehicleRepository.setDefaultVehicle(userId, vehicleId);
  }
}

module.exports = new VehicleService();

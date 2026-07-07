const parkingLotRepository = require('../repositories/parkingLot.repository');
const ApiError = require('../utils/apiError');

class ParkingLotService {
  /**
   * Create a new parking lot (Admin only).
   */
  async createParkingLot(adminId, parkingLotData) {
    return await parkingLotRepository.create({
      ...parkingLotData,
      createdBy: adminId,
    });
  }

  /**
   * Fetch all parking lots matching query filters.
   * Public users are restricted to active parking lots only.
   */
  async getParkingLots(filters, isAdmin) {
    const finalFilters = { ...filters };

    if (!isAdmin) {
      finalFilters.isActive = true;
    }

    return await parkingLotRepository.findAll(finalFilters);
  }

  /**
   * Fetch a single parking lot.
   * Validates active status if requested by a public user.
   */
  async getParkingLotById(parkingLotId, isAdmin) {
    const parkingLot = await parkingLotRepository.findById(parkingLotId);
    if (!parkingLot) {
      throw new ApiError(404, 'Parking lot not found');
    }

    if (!isAdmin && !parkingLot.isActive) {
      throw new ApiError(404, 'Parking lot not found');
    }

    return parkingLot;
  }

  /**
   * Update details of a parking lot (Admin only).
   */
  async updateParkingLot(parkingLotId, updateData) {
    const parkingLot = await parkingLotRepository.findById(parkingLotId);
    if (!parkingLot) {
      throw new ApiError(404, 'Parking lot not found');
    }

    return await parkingLotRepository.update(parkingLotId, updateData);
  }

  /**
   * Delete a parking lot from the database (Admin only).
   */
  async deleteParkingLot(parkingLotId) {
    const parkingLot = await parkingLotRepository.findById(parkingLotId);
    if (!parkingLot) {
      throw new ApiError(404, 'Parking lot not found');
    }

    await parkingLotRepository.delete(parkingLotId);
    return parkingLot;
  }
}

module.exports = new ParkingLotService();

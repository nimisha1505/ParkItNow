const parkingSlotRepository = require('../repositories/parkingSlot.repository');
const parkingLotRepository = require('../repositories/parkingLot.repository');
const ApiError = require('../utils/apiError');

class ParkingSlotService {
  /**
   * Syncs total and available slots counts on a parking lot.
   */
  async syncParkingLotSlots(parkingLotId) {
    const { totalSlots, availableSlots } = await parkingSlotRepository.countSlots(parkingLotId);
    await parkingLotRepository.update(parkingLotId, { totalSlots, availableSlots });
  }

  /**
   * Create a new parking slot. Syncs slot count in parking lot.
   */
  async createParkingSlot(adminId, slotData) {
    const { parkingLot, slotNumber } = slotData;

    const lot = await parkingLotRepository.findById(parkingLot);
    if (!lot) {
      throw new ApiError(404, 'Parking lot not found');
    }

    const existingSlot = await parkingSlotRepository.findByLotAndSlotNumber(parkingLot, slotNumber);
    if (existingSlot) {
      throw new ApiError(409, `Slot number ${slotNumber} already exists in this parking lot`);
    }

    const newSlot = await parkingSlotRepository.create({
      ...slotData,
      createdBy: adminId,
    });

    await this.syncParkingLotSlots(parkingLot);

    return newSlot;
  }

  /**
   * Retrieve all slots matching filters. Applies default status filter 'available' if public.
   */
  async getParkingSlots(filters, isAdmin) {
    const finalFilters = { ...filters };

    if (!isAdmin && !finalFilters.status) {
      finalFilters.status = 'available';
    }

    return await parkingSlotRepository.findAll(finalFilters, !isAdmin);
  }

  /**
   * Fetch a single slot. Verifies lot activity for public users.
   */
  async getParkingSlotById(slotId, isAdmin) {
    const slot = await parkingSlotRepository.findById(slotId);
    if (!slot) {
      throw new ApiError(404, 'Parking slot not found');
    }

    if (!isAdmin && (!slot.parkingLot || !slot.parkingLot.isActive)) {
      throw new ApiError(404, 'Parking slot not found');
    }

    return slot;
  }

  /**
   * Update slot details. Recalculates slots counts for original and target lots.
   */
  async updateParkingSlot(slotId, updateData) {
    const slot = await parkingSlotRepository.findById(slotId);
    if (!slot) {
      throw new ApiError(404, 'Parking slot not found');
    }

    const { slotNumber, parkingLot } = updateData;
    const targetLotId = parkingLot || slot.parkingLot._id;

    if (
      (slotNumber && slotNumber !== slot.slotNumber) ||
      (parkingLot && parkingLot.toString() !== slot.parkingLot._id.toString())
    ) {
      const existingSlot = await parkingSlotRepository.findByLotAndSlotNumber(
        targetLotId,
        slotNumber || slot.slotNumber
      );
      if (existingSlot) {
        throw new ApiError(409, `Slot number ${slotNumber || slot.slotNumber} already exists in target lot`);
      }
    }

    const updatedSlot = await parkingSlotRepository.update(slotId, updateData);

    await this.syncParkingLotSlots(slot.parkingLot._id);

    if (parkingLot && parkingLot.toString() !== slot.parkingLot._id.toString()) {
      await this.syncParkingLotSlots(parkingLot);
    }

    return updatedSlot;
  }

  /**
   * Delete a parking slot. Recalculates lot counts.
   */
  async deleteParkingSlot(slotId) {
    const slot = await parkingSlotRepository.findById(slotId);
    if (!slot) {
      throw new ApiError(404, 'Parking slot not found');
    }

    await parkingSlotRepository.delete(slotId);
    await this.syncParkingLotSlots(slot.parkingLot._id);

    return slot;
  }
}

module.exports = new ParkingSlotService();

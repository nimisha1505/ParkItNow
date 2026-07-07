const { Router } = require('express');
const {
  createParkingSlot,
  getParkingSlots,
  getParkingSlotById,
  updateParkingSlot,
  deleteParkingSlot,
} = require('../controllers/parkingSlot.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const {
  validateCreateParkingSlot,
  validateUpdateParkingSlot,
} = require('../validators/parkingSlot.validator');

const router = Router();

// Routes definitions
router
  .route('/')
  .post(verifyJWT, validateCreateParkingSlot, createParkingSlot)
  .get(getParkingSlots);

router
  .route('/:slotId')
  .get(getParkingSlotById)
  .patch(verifyJWT, validateUpdateParkingSlot, updateParkingSlot)
  .delete(verifyJWT, deleteParkingSlot);

module.exports = router;

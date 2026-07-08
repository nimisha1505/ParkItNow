import { Router } from 'express';
import {
  createParkingSlot,
  getParkingSlots,
  getParkingSlotById,
  updateParkingSlot,
  deleteParkingSlot,
} from '../controllers/parkingSlot.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  validateCreateParkingSlot,
  validateUpdateParkingSlot,
} from '../middlewares/parkingSlot.validator.js';

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

export default router;

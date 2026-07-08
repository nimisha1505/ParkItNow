import { Router } from 'express';
import {
  createParkingLot,
  getParkingLots,
  getParkingLotById,
  updateParkingLot,
  deleteParkingLot,
} from '../controllers/parkingLot.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  validateCreateParkingLot,
  validateUpdateParkingLot,
} from '../middlewares/parkingLot.validator.js';

const router = Router();

// Public read routes, Admin-restricted write/delete routes
router
  .route('/')
  .post(verifyJWT, validateCreateParkingLot, createParkingLot)
  .get(getParkingLots);

router
  .route('/:parkingLotId')
  .get(getParkingLotById)
  .patch(verifyJWT, validateUpdateParkingLot, updateParkingLot)
  .delete(verifyJWT, deleteParkingLot);

export default router;

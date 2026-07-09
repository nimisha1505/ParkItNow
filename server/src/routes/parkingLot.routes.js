import { Router } from 'express';
import {
  createParkingLot,
  getParkingLots,
  getParkingLotById,
  updateParkingLot,
  deleteParkingLot,
  approveParkingLot,
  rejectParkingLot,
} from '../controllers/parkingLot.controller.js';
import { verifyJWT, isSuperAdmin } from '../middlewares/auth.middleware.js';
import {
  validateCreateParkingLot,
  validateUpdateParkingLot,
} from '../middlewares/parkingLot.validator.js';

const router = Router();

// Public read routes, Owner/Admin-restricted write/delete routes
router
  .route('/')
  .post(verifyJWT, validateCreateParkingLot, createParkingLot)
  .get(getParkingLots);

router
  .route('/:parkingLotId')
  .get(getParkingLotById)
  .patch(verifyJWT, validateUpdateParkingLot, updateParkingLot)
  .delete(verifyJWT, deleteParkingLot);

router.patch('/:parkingLotId/approve', verifyJWT, isSuperAdmin, approveParkingLot);
router.patch('/:parkingLotId/reject', verifyJWT, isSuperAdmin, rejectParkingLot);

export default router;

import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  setDefaultVehicle,
} from '../controllers/vehicle.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  validateCreateVehicle,
  validateUpdateVehicle,
} from '../middlewares/vehicle.validator.js';

const router = Router();

// Protect all vehicle routes
router.use(verifyJWT);

router
  .route('/')
  .post(validateCreateVehicle, createVehicle)
  .get(getVehicles);

router
  .route('/:vehicleId')
  .get(getVehicleById)
  .patch(validateUpdateVehicle, updateVehicle)
  .delete(deleteVehicle);

router.patch('/:vehicleId/default', setDefaultVehicle);

export default router;

const { Router } = require('express');
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  setDefaultVehicle,
} = require('../controllers/vehicle.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const {
  validateCreateVehicle,
  validateUpdateVehicle,
} = require('../validators/vehicle.validator');

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

module.exports = router;

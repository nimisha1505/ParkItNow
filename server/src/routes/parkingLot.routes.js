const { Router } = require('express');
const {
  createParkingLot,
  getParkingLots,
  getParkingLotById,
  updateParkingLot,
  deleteParkingLot,
} = require('../controllers/parkingLot.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const {
  validateCreateParkingLot,
  validateUpdateParkingLot,
} = require('../validators/parkingLot.validator');

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

module.exports = router;

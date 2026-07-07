const { Router } = require('express');
const {
  getOverview,
  getRevenue,
  getOccupancy,
  getRecentBookings,
} = require('../controllers/adminDashboard.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

const router = Router();

// Protect all admin dashboard endpoints
router.use(verifyJWT);

router.get('/overview', getOverview);
router.get('/revenue', getRevenue);
router.get('/occupancy', getOccupancy);
router.get('/recent-bookings', getRecentBookings);

module.exports = router;

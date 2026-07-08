import { Router } from 'express';
import {
  getOverview,
  getRevenue,
  getOccupancy,
  getRecentBookings,
} from '../controllers/adminDashboard.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all admin dashboard endpoints
router.use(verifyJWT);

router.get('/overview', getOverview);
router.get('/revenue', getRevenue);
router.get('/occupancy', getOccupancy);
router.get('/recent-bookings', getRecentBookings);

export default router;

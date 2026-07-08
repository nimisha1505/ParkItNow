import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  validateRegister,
  validateLogin,
} from '../middlewares/auth.validator.js';

const router = Router();

// Open routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.post('/logout', verifyJWT, logoutUser);
router.get('/current-user', verifyJWT, getCurrentUser);

export default router;

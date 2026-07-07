const { Router } = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} = require('../controllers/auth.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const {
  validateRegister,
  validateLogin,
} = require('../validators/auth.validator');

const router = Router();

// Open routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.post('/logout', verifyJWT, logoutUser);
router.get('/current-user', verifyJWT, getCurrentUser);

module.exports = router;

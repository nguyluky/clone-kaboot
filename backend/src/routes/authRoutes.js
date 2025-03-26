const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Check if a token is valid (simple check without full verification)
router.post('/check-token', authController.checkToken);

// Get user info from token (requires token verification)
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;

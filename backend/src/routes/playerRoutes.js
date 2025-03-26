const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { verifyToken, isAdmin, adminOrSelfPlayer } = require('../middleware/authMiddleware');

// Routes available to players without authentication
// Register player for a session
router.post('/register', playerController.registerPlayer);

// Submit a single answer (no auth needed - uses player_id from request body)
router.post('/answer', playerController.submitAnswer);

// Submit all answers at once (no auth needed - uses player_id from request body)
router.post('/submit-all', playerController.submitAllAnswers);

// Checkout player (no auth needed - client-side protection sufficient)
router.post('/:id/checkout', playerController.checkoutPlayer);

// Routes that require authentication
// Get player details - admin or self access only
router.get('/:id', verifyToken, adminOrSelfPlayer('id'), playerController.getPlayerDetail);

// Admin-only routes
// Get all players (admin dashboard)
router.get('/', verifyToken, isAdmin, playerController.getAllPlayers);

module.exports = router;

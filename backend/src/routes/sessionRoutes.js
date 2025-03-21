const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes for all users
// Get all public sessions
router.get('/public', sessionController.getAllPublicSessions);

// Get public session by canvas ID
router.get('/public/canvas/:canvasId', sessionController.getPublicSessionByCanvasId);

// Join session by code
router.post('/join', sessionController.joinSession);

// Admin-only routes
// Get all sessions (including private ones)
router.get('/', verifyToken, isAdmin, sessionController.getAllSessions);

// Get session by ID
router.get('/:id', verifyToken, isAdmin, sessionController.getSessionById);

// Get detailed session info
router.get('/:id/detail', verifyToken, isAdmin, sessionController.getSessionDetail);

// Create new session
router.post('/', verifyToken, isAdmin, sessionController.createSession);

module.exports = router;

const express = require('express');
const router = express.Router();
const canvaController = require('../controllers/canvaController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes - Read-only access for players to view published canvases
// Get all canvases - available to everyone
router.get('/', canvaController.getAllCanvas);

// Get canvas by ID - available to everyone
router.get('/:id', canvaController.getCanvaById);

// Get detailed canvas info by ID - available to everyone
router.get('/:id/detail', canvaController.getCanvaDetail);

// Protected routes - admin only
// Create new canvas - admin only
router.post('/', verifyToken, isAdmin, canvaController.createCanva);

// Update canvas - admin only
router.put('/:id', verifyToken, isAdmin, canvaController.updateCanva);

// Delete canvas - admin only
router.delete('/:id', verifyToken, isAdmin, canvaController.deleteCanva);

module.exports = router;

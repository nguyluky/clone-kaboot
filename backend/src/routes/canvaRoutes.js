const express = require('express');
const router = express.Router();
const canvaController = require('../controllers/canvaController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');


router.use(verifyToken, isAdmin)

// Get all canvases - available to everyone
router.get('/', canvaController.getAllCanvas);

// Get canvas by ID - available to everyone
router.get('/:id', canvaController.getCanvaById);

// Get detailed canvas info by ID - available to everyone
router.get('/:id/detail', canvaController.getCanvaDetail);

// Create new canvas - admin only
router.post('/', canvaController.createCanva);

// Update canvas - admin only
router.put('/:id', canvaController.updateCanva);

// Delete canvas - admin only
router.delete('/:id', canvaController.deleteCanva);

module.exports = router;

const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken, isAdmin);

// Public route - can be viewed by anyone
// Get question by ID
router.get('/:id', questionController.getQuestionById);

// Protected routes - admin only
// Create a new question
router.post('/', questionController.createQuestion);

// Update a question
router.put('/:id', questionController.updateQuestion);

// Delete a question
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;

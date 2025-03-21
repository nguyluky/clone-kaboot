const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public route - can be viewed by anyone
// Get question by ID
router.get('/:id', questionController.getQuestionById);

// Protected routes - admin only
// Create a new question
router.post('/', verifyToken, isAdmin, questionController.createQuestion);

// Update a question
router.put('/:id', verifyToken, isAdmin, questionController.updateQuestion);

// Delete a question
router.delete('/:id', verifyToken, isAdmin, questionController.deleteQuestion);

module.exports = router;

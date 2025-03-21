const questionModel = require('../models/questionModel');
const canvaModel = require('../models/canvaModel');

class QuestionController {
    async getQuestionById(req, res) {
        try {
            const { id } = req.params;
            const question = await questionModel.getQuestionById(id);

            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            res.status(200).json(question);
        } catch (error) {
            console.error('Error in getQuestionById controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createQuestion(req, res) {
        try {
            const { canva_id, type, question, points, timeLimit, options } = req.body;

            if (!canva_id || !type || !question || !points || !timeLimit) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Verify that the canvas exists
            const canvas = await canvaModel.getCanvaById(canva_id);

            if (!canvas) {
                return res.status(404).json({ message: 'Canvas not found' });
            }

            // Validate question type
            if (!['multiple_choice', 'single_choice', 'text'].includes(type)) {
                return res.status(400).json({ message: 'Invalid question type' });
            }

            // Validate options for multiple/single choice questions
            if (type !== 'text' && (!options || !options.length)) {
                return res.status(400).json({ message: 'Options are required for choice questions' });
            }

            const questionData = {
                canva_id,
                type,
                question,
                points,
                timeLimit,
                options
            };

            const questionId = await questionModel.createQuestion(questionData);

            res.status(201).json({
                id: questionId,
                message: 'Question created successfully'
            });
        } catch (error) {
            console.error('Error in createQuestion controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateQuestion(req, res) {
        try {
            const { id } = req.params;
            const { type, question, points, timeLimit, options } = req.body;

            // Check if at least one field is provided
            if (!type && !question && !points && !timeLimit && !options) {
                return res.status(400).json({ message: 'No fields to update' });
            }

            // Verify that the question exists
            const existingQuestion = await questionModel.getQuestionById(id);

            if (!existingQuestion) {
                return res.status(404).json({ message: 'Question not found' });
            }

            // Prepare updated data
            const questionData = {
                type: type || existingQuestion.type,
                question: question || existingQuestion.question,
                points: points || existingQuestion.points,
                timeLimit: timeLimit || existingQuestion.timeLimit
            };

            // Only update options if provided
            if (options) {
                questionData.options = options;
            }

            await questionModel.updateQuestion(id, questionData);

            res.status(200).json({ message: 'Question updated successfully' });
        } catch (error) {
            console.error('Error in updateQuestion controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteQuestion(req, res) {
        try {
            const { id } = req.params;

            // Verify that the question exists
            const question = await questionModel.getQuestionById(id);

            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            await questionModel.deleteQuestion(id);

            res.status(200).json({ message: 'Question deleted successfully' });
        } catch (error) {
            console.error('Error in deleteQuestion controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new QuestionController();

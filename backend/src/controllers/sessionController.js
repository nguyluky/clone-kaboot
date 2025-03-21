const sessionModel = require('../models/sessionModel');
const canvaModel = require('../models/canvaModel');
const playerModel = require('../models/playerModel');
const questionModel = require('../models/questionModel');

class SessionController {
    async getAllSessions(req, res) {
        try {
            const sessions = await sessionModel.getAllSessions();
            res.status(200).json(sessions);
        } catch (error) {
            console.error('Error in getAllSessions controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getSessionById(req, res) {
        try {
            const { id } = req.params;
            const session = await sessionModel.getSessionById(id);

            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }

            res.status(200).json(session);
        } catch (error) {
            console.error('Error in getSessionById controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getSessionDetail(req, res) {
        try {
            const { id } = req.params;
            const session = await sessionModel.getSessionDetail(id);

            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }

            res.status(200).json(session);
        } catch (error) {
            console.error('Error in getSessionDetail controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createSession(req, res) {
        try {
            const { name, canva_id, is_public } = req.body;

            if (!name || !canva_id) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Verify that the canvas exists
            const canvas = await canvaModel.getCanvaById(canva_id);

            if (!canvas) {
                return res.status(404).json({ message: 'Canvas not found' });
            }

            try {
                const session = await sessionModel.createSession({
                    name,
                    canva_id,
                    is_public: is_public || false
                });

                res.status(201).json({
                    id: session.id,
                    code: session.code,
                    message: 'Session created successfully'
                });
            } catch (error) {
                if (error.message === 'Canvas đã có phiên thi public') {
                    return res.status(400).json({ message: error.message });
                }
                throw error; // Re-throw để handler lỗi phía dưới bắt
            }
        } catch (error) {
            console.error('Error in createSession controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Thêm endpoint mới để lấy danh sách phiên thi public
    async getAllPublicSessions(req, res) {
        try {
            const sessions = await sessionModel.getAllPublicSessions();
            res.status(200).json(sessions);
        } catch (error) {
            console.error('Error in getAllPublicSessions controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Thêm endpoint để lấy phiên thi public của một canvas
    async getPublicSessionByCanvasId(req, res) {
        try {
            const { canvasId } = req.params;
            const session = await sessionModel.getPublicSessionByCanvasId(canvasId);

            if (!session) {
                return res.status(404).json({ message: 'Public session not found for this canvas' });
            }

            res.status(200).json(session);
        } catch (error) {
            console.error('Error in getPublicSessionByCanvasId controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async joinSession(req, res) {
        try {
            const { code, playerName, playerPhone, playerEmail } = req.body;

            if (!code) {
                return res.status(400).json({ message: 'Session code is required' });
            }

            // Required for creating a player
            if (!playerName) {
                return res.status(400).json({ message: 'Player name is required' });
            }

            const session = await sessionModel.getSessionByCode(code);

            if (!session) {
                return res.status(404).json({ message: 'Invalid session code' });
            }

            // Get all questions for this session's canvas
            const questions = await questionModel.getQuestionsByCanvaId(session.canva_id);

            // Create player in the same request
            const playerData = {
                name: playerName,
                sdt: playerPhone || '',
                email: playerEmail || '',
                session_id: session.id
            };

            const playerId = await playerModel.createPlayer(playerData);

            res.status(200).json({
                session_id: session.id,
                player_id: playerId,
                name: session.name,
                quiz: session.quiz,
                questions: questions
            });
        } catch (error) {
            console.error('Error in joinSession controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new SessionController();

const playerModel = require('../models/playerModel');
const sessionModel = require('../models/sessionModel');

class PlayerController {
    async registerPlayer(req, res) {
        try {
            const { name, sdt, email, session_id } = req.body;

            if (!name || !session_id || !std || !email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Verify that the session exists
            const session = await sessionModel.getSessionById(session_id);

            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }

            const playerId = await playerModel.createPlayer({
                name,
                sdt: sdt ,
                email: email ,
                session_id
            });

            res.status(201).json({
                id: playerId,
                message: 'Player registered successfully'
            });
        } catch (error) {
            console.error('Error in registerPlayer controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getPlayerDetail(req, res) {
        try {
            const { id } = req.params;
            const player = await playerModel.getPlayerDetail(id);

            if (!player) {
                return res.status(404).json({ message: 'Player not found' });
            }

            res.status(200).json(player);
        } catch (error) {
            console.error('Error in getPlayerDetail controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // not use
    async submitAnswer(req, res) {
        try {
            const { player_id, question_id, option_id, responseTime } = req.body;

            if (!player_id || !question_id || !responseTime) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const answerId = await playerModel.submitAnswer({
                player_id,
                question_id,
                option_id,
                responseTime
            });

            res.status(201).json({
                id: answerId,
                message: 'Answer submitted successfully'
            });
        } catch (error) {
            console.error('Error in submitAnswer controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // New method to submit all answers at once
    async submitAllAnswers(req, res) {
        try {
            const { player_id, answers } = req.body;

            if (!player_id || !answers || !Array.isArray(answers)) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Verify player exists
            const player = await playerModel.getPlayerById(player_id);
            if (!player) {
                return res.status(404).json({ message: 'Player not found' });
            }

            // Process all answers in a transaction
            const results = await playerModel.submitAllAnswers(player_id, answers);

            // Mark player as checked out
            await playerModel.checkoutPlayer(player_id);

            // Calculate score and details
            // const playerDetails = await playerModel.getPlayerDetail(player_id);

            res.status(201).json({
                message: 'All answers submitted successfully',
                // answersProcessed: results.length,
                // score: playerDetails.score,
                // correctAnswers: playerDetails.correctAnswers,
                // incorrectAnswers: playerDetails.incorrectAnswers
            });
        } catch (error) {
            console.error('Error in submitAllAnswers controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // New method to get all players (for admin dashboard)
    async getAllPlayers(req, res) {
        try {
            const players = await playerModel.getAllPlayers();
            res.status(200).json(players);
        } catch (error) {
            console.error('Error in getAllPlayers controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async checkoutPlayer(req, res) {
        try {
            const { id } = req.params;

            const player = await playerModel.getPlayerById(id);

            if (!player) {
                return res.status(404).json({ message: 'Player not found' });
            }

            await playerModel.checkoutPlayer(id);

            res.status(200).json({ message: 'Player checked out successfully' });
        } catch (error) {
            console.error('Error in checkoutPlayer controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new PlayerController();

const db = require('../config/db');

class PlayerModel {
    async createPlayer(playerData) {
        try {
            const now = new Date();

            const [result] = await db.query(
                'INSERT INTO Player (name, sdt, email, checkIn, session_id) VALUES (?, ?, ?, ?, ?)',
                [playerData.name, playerData.sdt, playerData.email, now, playerData.session_id]
            );

            return result.insertId;
        } catch (error) {
            console.error('Error creating player:', error);
            throw error;
        }
    }

    async getPlayerById(id) {
        try {
            const [players] = await db.query(`
        SELECT p.*, s.name as sessionName, c.title as quizName
        FROM Player p
        JOIN Session s ON p.session_id = s.id
        JOIN Canva c ON s.canva_id = c.id
        WHERE p.id = ?
      `, [id]);

            if (players.length === 0) {
                return null;
            }

            return players[0];
        } catch (error) {
            console.error('Error getting player by id:', error);
            throw error;
        }
    }

    async getPlayerDetail(id) {
        try {
            const player = await this.getPlayerById(id);
            if (!player) {
                return null;
            }

            // Get session and quiz info
            const [sessionInfo] = await db.query(`
        SELECT s.id, s.name as sessionName, c.id as canvaId, c.title as quizName, 
        s.created as date, COUNT(q.id) as totalQuestions
        FROM Session s
        JOIN Canva c ON s.canva_id = c.id
        JOIN Question q ON q.canva_id = c.id
        WHERE s.id = ?
        GROUP BY s.id
      `, [player.session_id]);

            if (sessionInfo.length === 0) {
                return null;
            }

            // Get answers
            const [answers] = await db.query(`
        SELECT a.question_id as questionId, q.question as questionText, 
            a.responseTime, q.point as points,
            (SELECT o.text FROM Options o WHERE o.id = a.option_id) as participantAnswer,
            (SELECT o.text FROM Options o WHERE o.question_id = q.id AND o.isCorrect = 1 LIMIT 1) as correctAnswer,
            (SELECT o.isCorrect FROM Options o WHERE o.id = a.option_id) as isCorrect
        FROM Answers a
        JOIN Question q ON a.question_id = q.id
        WHERE a.player_id = ?
      `, [id]);

            // Calculate statistics
            const correctAnswers = answers.filter(a => a.isCorrect).length;
            const incorrectAnswers = answers.filter(a => !a.isCorrect).length;

            // Get player rank
            const [rankData] = await db.query(`
        SELECT 
            COUNT(*) + 1 as \`rank\`
        FROM Player p2
        JOIN Session s ON p2.session_id = s.id
        WHERE s.id = ? AND (
          (SELECT COUNT(*) FROM Answers a1 
           JOIN Options o1 ON a1.option_id = o1.id 
           WHERE a1.player_id = p2.id AND o1.isCorrect = 1) >
          (SELECT COUNT(*) FROM Answers a2 
           JOIN Options o2 ON a2.option_id = o2.id 
           WHERE a2.player_id = ? AND o2.isCorrect = 1)
        )
      `, [player.session_id, id]);


            return {
                id: player.id,
                name: player.name,
                sdt: player.sdt,
                email: player.email,
                score: (correctAnswers / sessionInfo[0].totalQuestions) * 100 || 0,
                correctAnswers,
                incorrectAnswers,
                averageResponseTime: answers.reduce((sum, a) => sum + a.responseTime, 0) / answers.length || 0,
                sessionName: sessionInfo[0].sessionName,
                quizName: sessionInfo[0].quizName,
                date: sessionInfo[0].date,
                totalQuestions: sessionInfo[0].totalQuestions,
                rank: rankData[0].rank,
                checkIn: player.checkIn,
                checkOut: player.checkOut,
                answers
            };
        } catch (error) {
            console.error('Error getting player detail:', error);
            throw error;
        }
    }

    async submitAnswer(answerData) {
        try {
            const { player_id, question_id, option_id, responseTime } = answerData;

            const [result] = await db.query(
                'INSERT INTO Answers (player_id, question_id, option_id, responseTime) VALUES (?, ?, ?, ?)',
                [player_id, question_id, option_id, responseTime]
            );

            return result.insertId;
        } catch (error) {
            console.error('Error submitting answer:', error);
            throw error;
        }
    }

    async submitAllAnswers(playerId, answers) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const results = [];

            for (const answer of answers) {
                const { question_id, option_ids, responseTime, text_answer } = answer;

                // nếu là câu điền thì kiểm tra xem text có giống không nếu giống thì inster Answers kèm opstion id là câu hỏi đúng
                // NOTE: tại lười sửa logic nên làm theo cách này
                if (text_answer) {
                    const [question] = await connection.query('SELECT * FROM `Question` WHERE id = ?;', [question_id])
                    if (question[0] && question[0].type != 'text') {
                        throw new Error("Text answers are not allowed for multiple-choice questions.");
                    }

                    const [options] = await connection.query('SELECT * FROM `Options` WHERE question_id = ?;', [question_id])

                    const [result] = await connection.query(
                            'INSERT INTO Answers (player_id, question_id, option_id, responseTime, text_answer) VALUES (?, ?, ?, ?, ?)',
                            [playerId, question_id, (options[0] && text_answer == options[0].text) ? options[0].id : null, responseTime, text_answer]
                        );
                    results.push({
                        id: result.insertId,
                        question_id,
                        responseTime
                    });
                    continue
                }

                for (const option_id of option_ids) {
                    const [result] = await connection.query(
                        'INSERT INTO Answers (player_id, question_id, option_id, responseTime) VALUES (?, ?, ?, ?)',
                        [playerId, question_id, option_id, responseTime]
                    );
    
                    results.push({
                        id: result.insertId,
                        question_id,
                        responseTime
                    });
                }

            }

            await connection.commit();
            return results;
        } catch (error) {
            await connection.rollback();
            console.error('Error submitting all answers:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async checkoutPlayer(id) {
        try {
            const now = new Date();

            await db.query(
                'UPDATE Player SET checkOut = ? WHERE id = ?',
                [now, id]
            );

            return true;
        } catch (error) {
            console.error('Error checking out player:', error);
            throw error;
        }
    }

    // New method to get all players (for admin dashboard)
    async getAllPlayers() {
        try {
            const [players] = await db.query(`
                SELECT p.*, s.name as sessionName, c.title as quizName
                FROM Player p
                JOIN Session s ON p.session_id = s.id
                JOIN Canva c ON s.canva_id = c.id
                ORDER BY p.checkIn DESC
            `);

            return players;
        } catch (error) {
            console.error('Error getting all players:', error);
            throw error;
        }
    }
}

module.exports = new PlayerModel();

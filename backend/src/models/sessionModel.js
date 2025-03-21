const db = require('../config/db');
const crypto = require('crypto');

class SessionModel {
    async getAllSessions() {
        try {
            const [sessions] = await db.query(`
        SELECT s.id, s.name, s.created, s.code_join, c.title as quiz,
        COUNT(DISTINCT p.id) as participants
        FROM Session s
        JOIN Canva c ON s.canva_id = c.id
        LEFT JOIN Player p ON p.session_id = s.id
        GROUP BY s.id
        ORDER BY s.created DESC
      `);

            return sessions;
        } catch (error) {
            console.error('Error getting all sessions:', error);
            throw error;
        }
    }

    async getSessionById(id) {
        try {
            const [sessions] = await db.query(`
        SELECT s.id, s.name, s.created, s.code_join, s.canva_id,
        c.title as quiz
        FROM Session s
        JOIN Canva c ON s.canva_id = c.id
        WHERE s.id = ?
      `, [id]);

            if (sessions.length === 0) {
                return null;
            }

            return sessions[0];
        } catch (error) {
            console.error('Error getting session by id:', error);
            throw error;
        }
    }

    async getSessionDetail(id) {
        try {
            const session = await this.getSessionById(id);
            if (!session) {
                return null;
            }

            // Get participants
            const [participants] = await db.query(`
        SELECT p.id, p.name, p.sdt, p.email, p.checkIn, p.checkOut,
        (SELECT COUNT(*) FROM Answers a 
         JOIN Options o ON a.option_id = o.id 
         WHERE a.player_id = p.id AND o.isCorrect = 1) as correctAnswers,
        (SELECT COUNT(*) FROM Answers a 
         JOIN Options o ON a.option_id = o.id 
         WHERE a.player_id = p.id AND o.isCorrect = 0) as incorrectAnswers,
        (SELECT AVG(a.responseTime) FROM Answers a WHERE a.player_id = p.id) as averageResponseTime
        FROM Player p
        WHERE p.session_id = ?
      `, [id]);

            // Calculate scores and add additional fields
            const [questions] = await db.query(`
        SELECT COUNT(*) as totalQuestions
        FROM Question q
        WHERE q.canva_id = ?
      `, [session.canva_id]);

            const totalQuestions = questions[0].totalQuestions;

            participants.forEach(participant => {
                participant.score = (participant.correctAnswers / totalQuestions) * 100 || 0;
                participant.totalQuestions = totalQuestions;
                participant.sessionName = session.name;
                participant.quizName = session.quiz;
                participant.date = session.created;
            });

            // Sort by score and assign ranks
            participants.sort((a, b) => b.score - a.score);
            participants.forEach((participant, index) => {
                participant.rank = index + 1;
            });

            session.participants = participants;

            // Get question statistics
            const [questionStats] = await db.query(`
        SELECT q.id, q.question,
        (SELECT COUNT(*) * 100.0 / COUNT(DISTINCT p.id)
         FROM Answers a
         JOIN Options o ON a.option_id = o.id
         JOIN Player p ON a.player_id = p.id
         WHERE a.question_id = q.id AND o.isCorrect = 1 AND p.session_id = ?) as correctPercentage,
        (SELECT AVG(a.responseTime)
         FROM Answers a
         JOIN Player p ON a.player_id = p.id
         WHERE a.question_id = q.id AND p.session_id = ?) as avgResponseTime
        FROM Question q
        WHERE q.canva_id = ?
      `, [id, id, session.canva_id]);

            // Get answer distribution for each question
            for (const question of questionStats) {
                const [distribution] = await db.query(`
          SELECT o.text as answer, o.isCorrect,
          COUNT(a.id) as count
          FROM Options o
          LEFT JOIN Answers a ON a.option_id = o.id AND a.player_id IN (
            SELECT id FROM Player WHERE session_id = ?
          )
          WHERE o.question_id = ?
          GROUP BY o.id
        `, [id, question.id]);

                question.distribution = distribution;
            }

            session.questions = questionStats;

            // Calculate session stats
            session.stats = {
                avgScore: participants.reduce((sum, p) => sum + p.score, 0) / participants.length || 0,
                avgTimePerQuestion: questionStats.reduce((sum, q) => sum + (q.avgResponseTime || 0), 0) / questionStats.length || 0,
                totalParticipants: participants.length,
                completionRate: participants.filter(p => p.checkOut !== null).length * 100 / participants.length || 0
            };

            return session;
        } catch (error) {
            console.error('Error getting session detail:', error);
            throw error;
        }
    }

    async createSession(sessionData) {
        try {
            const code = this.generateJoinCode();
            const now = new Date();

            // Kiểm tra xem đây có phải là phiên thi public không
            const isPublic = sessionData.is_public || false;

            // Nếu là phiên thi public, kiểm tra xem canvas đã có phiên public chưa
            if (isPublic) {
                const [existingPublic] = await db.query(
                    'SELECT id FROM Session WHERE canva_id = ? AND is_public = TRUE',
                    [sessionData.canva_id]
                );

                // Nếu đã có phiên public, trả về lỗi
                if (existingPublic.length > 0) {
                    throw new Error('Canvas đã có phiên thi public');
                }
            }

            const [result] = await db.query(
                'INSERT INTO Session (name, created, code_join, canva_id, is_public) VALUES (?, ?, ?, ?, ?)',
                [sessionData.name, now, code, sessionData.canva_id, isPublic]
            );

            return {
                id: result.insertId,
                code
            };
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    generateJoinCode() {
        return crypto.randomBytes(3).toString('hex').toUpperCase();
    }

    async getSessionByCode(code) {
        try {
            const [sessions] = await db.query(`
        SELECT s.id, s.name, s.created, s.code_join, s.canva_id,
        c.title as quiz
        FROM Session s
        JOIN Canva c ON s.canva_id = c.id
        WHERE s.code_join = ?
      `, [code]);

            if (sessions.length === 0) {
                return null;
            }

            return sessions[0];
        } catch (error) {
            console.error('Error getting session by code:', error);
            throw error;
        }
    }

    async getRecentSessionActivities(limit = 10) {
        try {
            const [activities] = await db.query(`
        SELECT s.id, 'session' as type, s.name as title, s.created as date,
        COUNT(p.id) as participants
        FROM Session s
        LEFT JOIN Player p ON p.session_id = s.id
        GROUP BY s.id
        ORDER BY s.created DESC
        LIMIT ?
      `, [limit]);

            return activities;
        } catch (error) {
            console.error('Error getting recent session activities:', error);
            throw error;
        }
    }

    // Thêm phương thức mới để lấy phiên thi public theo canvas ID
    async getPublicSessionByCanvasId(canvasId) {
        try {
            const [sessions] = await db.query(`
                SELECT s.id, s.name, s.created, s.code_join, s.canva_id, s.is_public,
                c.title as quiz
                FROM Session s
                JOIN Canva c ON s.canva_id = c.id
                WHERE s.canva_id = ? AND s.is_public = TRUE
            `, [canvasId]);

            if (sessions.length === 0) {
                return null;
            }

            return sessions[0];
        } catch (error) {
            console.error('Error getting public session:', error);
            throw error;
        }
    }

    // Thêm phương thức để lấy tất cả phiên thi public
    async getAllPublicSessions() {
        try {
            const [sessions] = await db.query(`
                SELECT s.id, s.name, s.created, s.code_join, s.is_public, c.title as quiz,
                COUNT(DISTINCT p.id) as participants
                FROM Session s
                JOIN Canva c ON s.canva_id = c.id
                LEFT JOIN Player p ON p.session_id = s.id
                WHERE s.is_public = TRUE
                GROUP BY s.id
                ORDER BY s.created DESC
            `);

            return sessions;
        } catch (error) {
            console.error('Error getting all public sessions:', error);
            throw error;
        }
    }
}

module.exports = new SessionModel();

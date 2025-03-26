const db = require('../config/db');

class CanvaModel {
    async getAllCanva() {
        try {
            const [canvases] = await db.query(`
        SELECT c.*, 
          COUNT(DISTINCT q.id) as questions,
          COUNT(DISTINCT s.id) as timesPlayed,
          COUNT(DISTINCT p.id) as totalParticipants
        FROM Canva c
        LEFT JOIN Question q ON q.canva_id = c.id
        LEFT JOIN Session s ON s.canva_id = c.id
        LEFT JOIN Player p ON p.session_id = s.id
        GROUP BY c.id
      `);

            // Add stats for each canvas
            for (const canvas of canvases) {
                const stats = await this.getCanvaStats(canvas.id);
                canvas.stats = stats;
            }

            return canvases;
        } catch (error) {
            console.error('Error getting all canvases:', error);
            throw error;
        }
    }

    async getCanvaById(id) {
        try {
            const [canvases] = await db.query(`
        SELECT c.*, 
          COUNT(DISTINCT q.id) as questions,
          COUNT(DISTINCT s.id) as timesPlayed,
          COUNT(DISTINCT p.id) as totalParticipants
        FROM Canva c
        LEFT JOIN Question q ON q.canva_id = c.id
        LEFT JOIN Session s ON s.canva_id = c.id
        LEFT JOIN Player p ON p.session_id = s.id
        WHERE c.id = ?
        GROUP BY c.id
      `, [id]);

            if (canvases.length === 0) {
                return null;
            }

            const canvas = canvases[0];
            canvas.stats = await this.getCanvaStats(id);

            return canvas;
        } catch (error) {
            console.error('Error getting canvas by id:', error);
            throw error;
        }
    }

    async getCanvaDetail(id) {
        try {
            const canvas = await this.getCanvaById(id);
            if (!canvas) {
                return null;
            }

            const [questions] = await db.query(`
        SELECT q.id, q.type, q.question, q.timeLimit, q.point as points
        FROM Question q
        WHERE q.canva_id = ?
      `, [id]);

            for (const question of questions) {
                const [options] = await db.query(`
          SELECT id, text, isCorrect
          FROM Options
          WHERE question_id = ?
        `, [question.id]);

                question.options = options;
            }

            canvas.questions = questions;

            return canvas;
        } catch (error) {
            console.error('Error getting canvas detail:', error);
            throw error;
        }
    }

    async getCanvaStats(canvaId) {
        try {
            // Get session data for this canvas
            const [sessionData] = await db.query(`
        SELECT COUNT(DISTINCT s.id) as timesPlayed,
          COUNT(DISTINCT p.id) as totalParticipants
        FROM Session s
        LEFT JOIN Player p ON p.session_id = s.id
        WHERE s.canva_id = ?
      `, [canvaId]);

            // Calculate average score
            const [scoreData] = await db.query(`
        SELECT AVG(
          (SELECT COUNT(*) FROM Answers a 
           JOIN Options o ON a.option_id = o.id 
           WHERE a.player_id = p.id AND o.isCorrect = 1) * 100.0 / 
          (SELECT COUNT(*) FROM Question q WHERE q.canva_id = ?)
        ) as avgScore
        FROM Player p
        JOIN Session s ON p.session_id = s.id
        WHERE s.canva_id = ?
      `, [canvaId, canvaId]);

            // Calculate completion rate
            const [completionData] = await db.query(`
        SELECT 
          COUNT(DISTINCT CASE WHEN p.checkOut IS NOT NULL THEN p.id END) * 100.0 / 
          NULLIF(COUNT(DISTINCT p.id), 0) as completionRate
        FROM Player p
        JOIN Session s ON p.session_id = s.id
        WHERE s.canva_id = ?
      `, [canvaId]);

            // Calculate difficulty rating based on average score
            let difficultyRating = "Medium";
            if (scoreData[0].avgScore > 75) {
                difficultyRating = "EZ";
            } else if (scoreData[0].avgScore < 50) {
                difficultyRating = "Hard";
            }

            return {
                timesPlayed: sessionData[0].timesPlayed || 0,
                totalParticipants: sessionData[0].totalParticipants || 0,
                avgScore: scoreData[0].avgScore || 0,
                completionRate: completionData[0].completionRate || 0,
                difficultyRating
            };
        } catch (error) {
            console.error('Error getting canvas stats:', error);
            throw error;
        }
    }

    async createCanva(canvaData) {
        try {
            const now = new Date();
            const [result] = await db.query(
                'INSERT INTO Canva (title, category, description, lastModified, created) VALUES (?, ?, ?, ?, ?)',
                [canvaData.title, canvaData.category, canvaData.description, now, now]
            );

            return result.insertId;
        } catch (error) {
            console.error('Error creating canvas:', error);
            throw error;
        }
    }

    async updateCanva(id, canvaData) {
        try {
            const now = new Date();
            await db.query(
                'UPDATE Canva SET title = ?, category = ?, description = ?, lastModified = ? WHERE id = ?',
                [canvaData.title, canvaData.category, canvaData.description, now, id]
            );

            return true;
        } catch (error) {
            console.error('Error updating canvas:', error);
            throw error;
        }
    }

    async deleteCanva(id) {
        try {
            await db.query('DELETE FROM Canva WHERE id = ?', [id]);
            return true;
        } catch (error) {
            console.error('Error deleting canvas:', error);
            throw error;
        }
    }

    async getRecentCanvaActivities(limit = 10) {
        try {
            const [activities] = await db.query(`
        SELECT id, 'canvas' as type, title, lastModified as date,
        CASE 
          WHEN created = lastModified THEN 'created'
          ELSE 'updated'
        END as action
        FROM Canva
        ORDER BY lastModified DESC
        LIMIT ?
      `, [limit]);

            return activities;
        } catch (error) {
            console.error('Error getting recent canvas activities:', error);
            throw error;
        }
    }
}

module.exports = new CanvaModel();

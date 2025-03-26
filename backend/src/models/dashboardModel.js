const db = require('../config/db');
const sessionModel = require('./sessionModel');
const canvaModel = require('./canvaModel');

class DashboardModel {
    async getDashboardStats() {
        try {
            // Get quick statistics
            const [canvasCount] = await db.query('SELECT COUNT(*) as count FROM Canva');
            const [participantCount] = await db.query('SELECT COUNT(*) as count FROM Player');
            const [sessionCount] = await db.query('SELECT COUNT(*) as count FROM Session');

            // Calculate total play time (sum of all session durations)
            const [playTimeData] = await db.query(`
        SELECT SUM(
          TIMESTAMPDIFF(MINUTE, p.checkIn, IFNULL(p.checkOut, NOW()))
        ) as totalMinutes
        FROM Player p
      `);

            // Count how many "reports" (assuming this means downloaded reports or analytics viewed)
            // Since we don't have a table for this, we'll use session count as a proxy
            const reports = sessionCount[0].count;

            return {
                quicks: canvasCount[0].count,
                participants: participantCount[0].count,
                conducted: sessionCount[0].count,
                play_time: playTimeData[0].totalMinutes || 0,
                reports
            };
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            throw error;
        }
    }

    async getRecentActivities(limit = 20) {
        try {
            const sessionActivities = await sessionModel.getRecentSessionActivities(limit);
            const canvasActivities = await canvaModel.getRecentCanvaActivities(limit);

            // Combine and sort by date
            const allActivities = [...sessionActivities, ...canvasActivities];
            allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

            return allActivities.slice(0, limit);
        } catch (error) {
            console.error('Error getting recent activities:', error);
            throw error;
        }
    }

    async getQuizPopular(limit = 5) {
        try {
            const [canvases] = await db.query(`
            SELECT c.id, c.title, c.category, c.description, c.lastModified, c.created, 
                COUNT(DISTINCT q.id) as questions,
                COUNT(DISTINCT s.id) as timesPlayed,
                COUNT(DISTINCT p.id) as totalParticipants
            FROM Canva c
            LEFT JOIN Question q ON q.canva_id = c.id
            LEFT JOIN Session s ON s.canva_id = c.id
            LEFT JOIN Player p ON p.session_id = s.id
            GROUP BY c.id
            ORDER BY totalParticipants DESC, timesPlayed DESC
            LIMIT ?
        `, [limit]);

            // Add stats for each canvas
            for (const canvas of canvases) {
                const stats = await canvaModel.getCanvaStats(canvas.id);
                canvas.stats = stats;
            }

            return canvases;
        } catch (error) {
            console.error('Error getting popular quizzes:', error);
            throw error;
        }
    }
}

module.exports = new DashboardModel();

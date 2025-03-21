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
}

module.exports = new DashboardModel();

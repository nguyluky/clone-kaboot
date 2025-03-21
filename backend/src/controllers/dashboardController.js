const dashboardModel = require('../models/dashboardModel');

class DashboardController {
    async getDashboardStats(req, res) {
        try {
            const stats = await dashboardModel.getDashboardStats();
            res.status(200).json(stats);
        } catch (error) {
            console.error('Error in getDashboardStats controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getRecentActivities(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const activities = await dashboardModel.getRecentActivities(limit);
            res.status(200).json(activities);
        } catch (error) {
            console.error('Error in getRecentActivities controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new DashboardController();

const { request, app, db, resetMocks, sampleData } = require('../testHelpers');
const jwt = require('jsonwebtoken');

// Mock these modules before importing or requiring them
jest.mock('../../models/sessionModel', () => ({
    getRecentSessionActivities: jest.fn()
}));

jest.mock('../../models/canvaModel', () => ({
    getRecentCanvaActivities: jest.fn()
}));

// Mock jwt
jest.mock('jsonwebtoken');

// Import the mocked modules
const sessionModel = require('../../models/sessionModel');
const canvaModel = require('../../models/canvaModel');

describe('Dashboard API', () => {
    const ADMIN_TOKEN = 'admin-token';

    beforeEach(() => {
        resetMocks();
        // Reset mocks for these modules too
        sessionModel.getRecentSessionActivities.mockReset();
        canvaModel.getRecentCanvaActivities.mockReset();

        // Setup JWT mock to validate admin token
        jwt.verify.mockImplementation((token) => {
            if (token === ADMIN_TOKEN) {
                return { id: 1, username: 'admin', role: 'admin' };
            }
            throw new Error('Invalid token');
        });
    });

    describe('GET /api/dashboard/stats', () => {
        it('should return dashboard statistics for admin users', async () => {
            // Mock canvas count
            db.query.mockResolvedValueOnce([[{ count: 5 }]]);
            // Mock participant count
            db.query.mockResolvedValueOnce([[{ count: 28 }]]);
            // Mock session count
            db.query.mockResolvedValueOnce([[{ count: 7 }]]);
            // Mock playtime data
            db.query.mockResolvedValueOnce([[{ totalMinutes: 480 }]]);

            const response = await request(app)
                .get('/api/dashboard/stats')
                .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('quicks', 5);
            expect(response.body).toHaveProperty('participants', 28);
            expect(response.body).toHaveProperty('conducted', 7);
            expect(response.body).toHaveProperty('play_time', 480);
            expect(response.body).toHaveProperty('reports', 7);
        });

        it('should return 401 if no token is provided', async () => {
            const response = await request(app).get('/api/dashboard/stats');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 403 if non-admin user tries to access', async () => {
            // Setup JWT mock to validate player token
            jwt.verify.mockImplementationOnce((token) => {
                return { id: 2, username: 'player', role: 'player' };
            });

            const response = await request(app)
                .get('/api/dashboard/stats')
                .set('Authorization', 'Bearer player-token');

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('message', 'Access denied. Admin privileges required.');
        });
    });

    describe('GET /api/dashboard/activities', () => {
        it('should return recent activities', async () => {
            // Mock session activities
            const sessionActivities = [{
                id: 1,
                type: 'session',
                title: 'Test Session',
                date: new Date().toISOString(),
                participants: 5
            }];

            // Mock canvas activities
            const canvasActivities = [{
                id: 2,
                type: 'canvas',
                title: 'Test Canvas',
                date: new Date().toISOString(),
                action: 'created'
            }];

            // Mock getRecentSessionActivities and getRecentCanvaActivities
            sessionModel.getRecentSessionActivities.mockResolvedValueOnce(sessionActivities);
            canvaModel.getRecentCanvaActivities.mockResolvedValueOnce(canvasActivities);

            const response = await request(app).get('/api/dashboard/activities');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
            expect(response.body[0]).toHaveProperty('type');
            expect(['session', 'canvas']).toContain(response.body[0].type);
        });

        it('should limit activities based on query parameter', async () => {
            // Mock session activities
            const sessionActivities = Array(5).fill(0).map((_, i) => ({
                id: i + 1,
                type: 'session',
                title: `Test Session ${i + 1}`,
                date: new Date().toISOString(),
                participants: 5
            }));

            // Mock canvas activities
            const canvasActivities = Array(5).fill(0).map((_, i) => ({
                id: i + 6,
                type: 'canvas',
                title: `Test Canvas ${i + 1}`,
                date: new Date().toISOString(),
                action: 'created'
            }));

            // Mock getRecentSessionActivities and getRecentCanvaActivities
            sessionModel.getRecentSessionActivities.mockResolvedValueOnce(sessionActivities);
            canvaModel.getRecentCanvaActivities.mockResolvedValueOnce(canvasActivities);

            const response = await request(app).get('/api/dashboard/activities?limit=3');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(3);
        });
    });
});

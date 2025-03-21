const { request, app, resetMocks } = require('../testHelpers');
const jwt = require('jsonwebtoken');

// Mock jwt
jest.mock('jsonwebtoken');

describe('Auth API', () => {
    beforeEach(() => {
        resetMocks();
        jwt.verify.mockReset();
    });

    describe('POST /api/auth/check-token', () => {
        it('should return valid:true for a valid token', async () => {
            // Setup
            jwt.verify.mockReturnValue({ id: 1 });

            // Execute
            const response = await request(app)
                .post('/api/auth/check-token')
                .send({ token: 'valid-token' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('valid', true);
        });

        it('should return valid:false for an invalid token', async () => {
            // Setup
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            // Execute
            const response = await request(app)
                .post('/api/auth/check-token')
                .send({ token: 'invalid-token' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('valid', false);
        });

        it('should return 400 if token is missing', async () => {
            // Execute
            const response = await request(app)
                .post('/api/auth/check-token')
                .send({});

            // Assert
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('valid', false);
            expect(response.body).toHaveProperty('message', 'Token is required');
        });
    });

    describe('GET /api/auth/verify', () => {
        it('should return user info if valid token is provided', async () => {
            // Setup - mock JWT token verification
            const mockUser = { id: 1, username: 'testuser', role: 'admin' };
            jwt.verify.mockReturnValue(mockUser);

            // Execute
            const response = await request(app)
                .get('/api/auth/verify')
                .set('Authorization', 'Bearer valid-token');

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('valid', true);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toMatchObject({
                id: 1,
                username: 'testuser',
                role: 'admin'
            });
        });

        it('should return 401 if no token is provided', async () => {
            // Execute
            const response = await request(app)
                .get('/api/auth/verify');

            // Assert
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 403 if token is invalid', async () => {
            // Setup - mock JWT token verification failure
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            // Execute
            const response = await request(app)
                .get('/api/auth/verify')
                .set('Authorization', 'Bearer invalid-token');

            // Assert
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('message', 'Invalid token');
        });
    });
});

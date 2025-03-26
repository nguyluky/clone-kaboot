const jwt = require('jsonwebtoken');
const authController = require('../../../controllers/authController');

// Mock jwt
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: {
                id: 1,
                username: 'testuser',
                role: 'admin'
            },
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('verifyToken', () => {
        it('should return user info from request', async () => {
            // Execute
            await authController.verifyToken(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                valid: true,
                user: expect.objectContaining({
                    id: 1,
                    username: 'testuser',
                    role: 'admin'
                })
            });
        });

        it('should handle errors', async () => {
            // Setup - simulate an error
            req.user = null; // This will cause an error when trying to access properties

            // Execute
            await authController.verifyToken(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('checkToken', () => {
        it('should return valid:true for a valid token', async () => {
            // Setup
            req.body.token = 'valid-token';
            jwt.verify.mockReturnValue({ id: 1 });

            // Execute
            await authController.checkToken(req, res);

            // Assert
            expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ valid: true });
        });

        it('should return valid:false for an invalid token', async () => {
            // Setup
            req.body.token = 'invalid-token';
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            // Execute
            await authController.checkToken(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ valid: false });
        });

        it('should return 400 if token is missing', async () => {
            // Setup
            req.body = {}; // No token

            // Execute
            await authController.checkToken(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                valid: false,
                message: expect.stringContaining('Token is required')
            }));
        });
    });
});

const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin, isPlayer, adminOrSelfPlayer } = require('../../../middleware/authMiddleware');

// Mock jwt
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('verifyToken', () => {
        it('should call next if token is valid', () => {
            // Setup
            const mockUser = { id: 1, username: 'testuser', role: 'admin' };
            req.headers.authorization = 'Bearer valid-token';
            jwt.verify.mockReturnValue(mockUser);

            // Execute
            verifyToken(req, res, next);

            // Assert
            expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 if no token is provided', () => {
            // Execute
            verifyToken(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining('No token')
            }));
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 403 if token is invalid', () => {
            // Setup
            req.headers.authorization = 'Bearer invalid-token';
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            // Execute
            verifyToken(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining('Invalid token')
            }));
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isAdmin', () => {
        it('should call next if user is admin', () => {
            // Setup
            req.user = { role: 'admin' };

            // Execute
            isAdmin(req, res, next);

            // Assert
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user is not admin', () => {
            // Setup
            req.user = { role: 'player' };

            // Execute
            isAdmin(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining('Admin privileges')
            }));
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isPlayer', () => {
        it('should call next if user is player', () => {
            // Setup
            req.user = { role: 'player' };

            // Execute
            isPlayer(req, res, next);

            // Assert
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user is not player', () => {
            // Setup
            req.user = { role: 'admin' };

            // Execute
            isPlayer(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('adminOrSelfPlayer', () => {
        it('should call next if user is admin', () => {
            // Setup
            req.user = { role: 'admin' };
            req.params.id = '5';

            // Execute
            const middleware = adminOrSelfPlayer('id');
            middleware(req, res, next);

            // Assert
            expect(next).toHaveBeenCalled();
        });

        it('should call next if user is the same player', () => {
            // Setup
            req.user = { role: 'player', playerId: 5 };
            req.params.id = '5';

            // Execute
            const middleware = adminOrSelfPlayer('id');
            middleware(req, res, next);

            // Assert
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if player tries to access another player', () => {
            // Setup
            req.user = { role: 'player', playerId: 6 };
            req.params.id = '5';

            // Execute
            const middleware = adminOrSelfPlayer('id');
            middleware(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });
});

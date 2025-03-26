const jwt = require('jsonwebtoken');

// Secret key should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

class AuthController {
    // Verify the token and return user info
    async verifyToken(req, res) {
        try {
            // Token is already verified in middleware
            // Return user info without sensitive data
            const userInfo = {
                id: req.user.id,
                username: req.user.username,
                role: req.user.role,
                // Include other non-sensitive user data from token
            };

            res.status(200).json({
                valid: true,
                user: userInfo
            });
        } catch (error) {
            console.error('Error in verifyToken controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Endpoint to check if a token is valid (doesn't require middleware)
    async checkToken(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ valid: false, message: 'Token is required' });
            }

            // Verify token
            jwt.verify(token, JWT_SECRET);

            // If verification doesn't throw an error, token is valid
            res.status(200).json({ valid: true });
        } catch (error) {
            console.error('Token check error:', error);
            res.status(200).json({ valid: false });
        }
    }
}

module.exports = new AuthController();

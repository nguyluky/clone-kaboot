const jwt = require('jsonwebtoken');

// Secret key should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        // console.log('Verifying token:', token, JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user info to request
        req.user = {
            role: 'admin'
        };

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

// Middleware to check if user is a player
const isPlayer = (req, res, next) => {
    if (req.user && req.user.role === 'player') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. This endpoint is for players only.' });
    }
};

// Middleware that allows either admin or specific player access
// Use for endpoints where players should only access their own data
const adminOrSelfPlayer = (paramIdField) => {
    return (req, res, next) => {
        if (req.user) {
            // Admin can access everything
            if (req.user.role === 'admin') {
                return next();
            }

            // Players can only access their own data
            if (req.user.role === 'player' && req.user.playerId === parseInt(req.params[paramIdField])) {
                return next();
            }
        }

        res.status(403).json({ message: 'Access denied. You can only access your own data.' });
    };
};

module.exports = {
    verifyToken,
    isAdmin,
    isPlayer,
    adminOrSelfPlayer
};

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // If the route explicitly allows optional auth, proceed
        if (req.isOptional) return next();
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (req.isOptional) return next();
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;

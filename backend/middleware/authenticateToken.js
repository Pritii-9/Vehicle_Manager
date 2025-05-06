// backend/middleware/authenticateToken.js

import jwt from 'jsonwebtoken';
import ActivityLog from '../models/ActivityLog.js'; // Adjust path if needed

const logUserActivity = async (userId) => {
    if (!userId) {
        console.warn("ActivityLog: Attempted to log activity without userId in middleware.");
        return;
    }
    try {
        const newLog = new ActivityLog({ userId: userId, timestamp: new Date() });
        await newLog.save();
    } catch (error) {
        console.error(`ActivityLog: Failed to log activity for user ${userId}:`, error);
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, userPayload) => {
        if (err) {
            // Log JWT errors (like expired, invalid signature)
            console.error('AuthMiddleware: JWT Verification Error:', err.name, '-', err.message);
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }

        // Attach decoded payload to request
        req.user = userPayload;

        // Log activity if userId is present in the token payload
        if (req.user && req.user.userId) {
            await logUserActivity(req.user.userId);
        } else {
           // Warn if the token structure is unexpected
           console.warn("AuthMiddleware: JWT payload missing 'userId' field after verification. Activity not logged.");
        }

        // Proceed to next step in request chain
        next();
    });
};

export default authenticateToken;
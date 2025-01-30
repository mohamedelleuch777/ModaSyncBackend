import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        console.log('❌ Invalid token');
        res.status(400).json({ error: 'Invalid token' });
    }
}

const isManager = (req, res, next) => {
    if (req.user.role !== "Manager") {
        return res.status(403).json({ error: "Access denied. Only managers can change roles." });
    }
    next(); // User is a manager, proceed
};

const exportedFunctions = {
    authenticateToken,
    isManager
}
export default exportedFunctions;

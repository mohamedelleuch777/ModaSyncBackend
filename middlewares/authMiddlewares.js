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
        res.status(400).json({ error: 'Invalid token' });
    }
}

const exportedFunctions = {
    authenticateToken
}
export default exportedFunctions;

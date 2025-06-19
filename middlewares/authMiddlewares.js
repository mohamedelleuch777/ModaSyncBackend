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
        res.status(401).json({ error: 'Invalid token' });
    }
}

const isManager = (req, res, next) => {
    if (req.user.role !== "Manager") {
        return res.status(403).json({ error: "Access denied. Only managers can change roles." });
    }
    next(); // User is a manager, proceed
};

const authorizeManager = (req, res, next) => {
    if (req.user.role !== "Manager") {
        return res.status(403).json({ error: "Access denied. Manager role required." });
    }
    next(); // User is a manager, proceed
};

const authorizeExternalTaskAccess = (req, res, next) => {
    const allowedRoles = ["Manager", "Joker", "Stylist"];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied. Manager, Joker, or Stylist role required." });
    }
    next(); // User has appropriate role, proceed
};

const whoAmI = (req, res, next) => {
    return req.user.role;
};

const getCurrentUserID = (req, res, next) => {
    return req.user.id;
};

const exportedFunctions = {
    authenticateToken,
    isManager,
    authorizeManager,
    authorizeExternalTaskAccess,
    whoAmI,
    getCurrentUserID
}

export { authenticateToken, isManager, authorizeManager, authorizeExternalTaskAccess, whoAmI, getCurrentUserID };
export default exportedFunctions;

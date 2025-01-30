import express from 'express';
import UsersController from '../controllers/usersController.js';
import exportedFunctions from '../middlewares/authMiddlewares.js';

const { authenticateToken } = exportedFunctions;

const router = express.Router();

// Public Routes
router.post('/register', UsersController.register);
router.post('/login', UsersController.login);

// Protected Routes
router.get('/', authenticateToken, UsersController.getAllUsers);
router.get('/email/:email', authenticateToken, UsersController.getUserByEmail);
router.get('/phone/:phone', authenticateToken, UsersController.getUserByPhone);

export default router;

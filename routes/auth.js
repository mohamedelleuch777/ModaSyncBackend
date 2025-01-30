import express from 'express';
import exportedFunctions from '../middlewares/authMiddlewares.js';
import AuthController from '../controllers/authController.js';

const { authenticateToken } = exportedFunctions;

const router = express.Router();

// Public Routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);



export default router;

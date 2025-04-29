import express from 'express';
import exportedFunctions from '../middlewares/authMiddlewares.js';
import TasksController from '../controllers/TasksController.js';

const { authenticateToken } = exportedFunctions;

const router = express.Router();

// Protected Routes
router.get('/', authenticateToken, TasksController.getAllAvailableTasks);

export default router;

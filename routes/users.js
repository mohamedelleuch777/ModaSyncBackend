import express from 'express';
import UsersController from '../controllers/usersController.js';
import exportedFunctions from '../middlewares/authMiddlewares.js';

const { authenticateToken, isManager } = exportedFunctions;

const router = express.Router();

// Protected Routes
router.get('/', authenticateToken, UsersController.getAllUsers);
router.get('/email/:email', authenticateToken, UsersController.getUserByEmail);
router.get('/phone/:phone', authenticateToken, UsersController.getUserByPhone);
router.delete('/:id', authenticateToken, UsersController.deleteUser);
router.put('/:id', authenticateToken, UsersController.editUser);
// ✅ Secure route: Only managers can change user roles
router.put("/role/:id", authenticateToken, isManager, UsersController.updateUserRole);


export default router;

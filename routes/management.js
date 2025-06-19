import express from 'express';
import ManagementController from '../controllers/ManagementController.js';
import { authenticateToken, authorizeManager, authorizeExternalTaskAccess } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Base authentication for all routes
router.use(authenticateToken);

// ===== USER MANAGEMENT ROUTES (Manager only) =====
router.get('/users', authorizeManager, ManagementController.getAllUsers);
router.post('/users', authorizeManager, ManagementController.createUser);
router.put('/users/:id', authorizeManager, ManagementController.updateUser);
router.put('/users/:id/role', authorizeManager, ManagementController.updateUserRole);
router.put('/users/:id/status', authorizeManager, ManagementController.toggleUserStatus);

// ===== EXTERNAL PROVIDER ROUTES (Manager, Joker, Stylist) =====
router.get('/external-providers', authorizeExternalTaskAccess, ManagementController.getAllExternalProviders);
router.post('/external-providers', authorizeExternalTaskAccess, ManagementController.createExternalProvider);
router.put('/external-providers/:id', authorizeExternalTaskAccess, ManagementController.updateExternalProvider);
router.put('/external-providers/:id/status', authorizeExternalTaskAccess, ManagementController.updateExternalProviderStatus);
router.delete('/external-providers/:id', authorizeExternalTaskAccess, ManagementController.deleteExternalProvider);

export default router;
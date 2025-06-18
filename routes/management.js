import express from 'express';
import ManagementController from '../controllers/ManagementController.js';
import { authenticateToken, authorizeManager } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Middleware to ensure only managers can access these routes
router.use(authenticateToken);
router.use(authorizeManager);

// ===== USER MANAGEMENT ROUTES =====
router.get('/users', ManagementController.getAllUsers);
router.post('/users', ManagementController.createUser);
router.put('/users/:id', ManagementController.updateUser);
router.put('/users/:id/role', ManagementController.updateUserRole);
router.put('/users/:id/status', ManagementController.toggleUserStatus);

// ===== EXTERNAL PROVIDER ROUTES =====
router.get('/external-providers', ManagementController.getAllExternalProviders);
router.post('/external-providers', ManagementController.createExternalProvider);
router.put('/external-providers/:id', ManagementController.updateExternalProvider);
router.put('/external-providers/:id/status', ManagementController.updateExternalProviderStatus);
router.delete('/external-providers/:id', ManagementController.deleteExternalProvider);

export default router;
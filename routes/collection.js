import express from 'express';
import exportedFunctions from '../middlewares/authMiddlewares.js';
import CollectionsController from '../controllers/collectionsController.js';

const { authenticateToken, isManager } = exportedFunctions;

const router = express.Router();

// Protected Routes
router.get('/', authenticateToken, CollectionsController.getAllCollections);
router.post('/', authenticateToken, CollectionsController.createCollection);


export default router;

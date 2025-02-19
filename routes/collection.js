import express from 'express';
import exportedFunctions from '../middlewares/authMiddlewares.js';
import CollectionsController from '../controllers/collectionsController.js';

const { authenticateToken, isManager } = exportedFunctions;

const router = express.Router();

// Protected Routes
router.get('/', authenticateToken, CollectionsController.getAllCollections);
router.get('/:id', authenticateToken, CollectionsController.getCollectionById);
router.post('/', authenticateToken, CollectionsController.createCollection);
router.put("/:id", authenticateToken, CollectionsController.editCollection);
router.delete("/:id", authenticateToken, CollectionsController.removeCollection);


export default router;

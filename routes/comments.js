import express from 'express';
import exportedFunctions from '../middlewares/authMiddlewares.js';
import CommentsController from '../controllers/CommentsController.js';

const { authenticateToken } = exportedFunctions;

const router = express.Router();

// Protected Routes
router.get('/:sample_id', authenticateToken, CommentsController.getSample_sConversation);
router.post('/', authenticateToken, CommentsController.makeComment);
router.delete("/:picture_id", authenticateToken, CommentsController.deleteComment);


export default router;

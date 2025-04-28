import CommentsModel from '../models/CommentsModel.js';
import { sseEmitter } from '../middlewares/sseEmitterMiddlewares.js';
// const { hashPassword, comparePassword } = FUNCTIONS;

import exportedFunctions from '../middlewares/authMiddlewares.js';

const {getCurrentUserID } = exportedFunctions;

class CommentsController {

    // Get Samlpe's commentes
    static async getSample_sConversation(req, res) {
        try {
            const { sample_id } = req.params;
            const conversation = await CommentsModel.fetchSample_sConversation(sample_id);
            res.json(conversation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Make Comments
    static async makeComment(req, res) {
        try {
            const { sample_id, comment_text } = req.body;
            const comment_owner = await getCurrentUserID(req, res);
            const newComment = await CommentsModel.addComment(sample_id, comment_text, comment_owner);
            const uuid = (new Date()).getTime();
            sseEmitter.emit('message', {
                id: uuid,
                type: 'comment',
                userId: comment_owner,
                data: newComment, 
                action: 'create',
                message: "New Comment Created"
            });
            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete Comment
    static async deleteComment(req, res) {
        try {
            const { comment_id } = req.params;
            const deletedComment = await CommentsModel.removeComment(comment_id);
            const uuid = (new Date()).getTime();
            sseEmitter.emit('message', {
                id: uuid,
                type: 'comment',
                commentId: comment_id,
                data: deletedComment, 
                action: 'delete',
                message: "Comment Removed"
            });
            res.json(deletedComment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


}

export default CommentsController;

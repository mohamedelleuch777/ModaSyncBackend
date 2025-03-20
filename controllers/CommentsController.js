import CommentsModel from '../models/CommentsModel.js';
import { sseEmitter } from '../middlewares/sseEmitterMiddlewares.js';
// const { hashPassword, comparePassword } = FUNCTIONS;

import exportedFunctions from '../middlewares/authMiddlewares.js';

const {getCurrentUserID } = exportedFunctions;

class CommentsController {

    // Get Picture's commentes
    static async getPicture_sComments(req, res) {
        try {
            const { picture_id } = req.params;
            const comments = await CommentsModel.fetchPicture_sComments(picture_id);
            res.json(comments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Make Comments
    static async makeComment(req, res) {
        try {
            const { picture_id, comment_text } = req.body;
            const comment_owner = await getCurrentUserID(req, res);
            const newComment = await CommentsModel.addComment(picture_id, comment_text, comment_owner);
            sseEmitter.emit('message', {
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
            sseEmitter.emit('message', {
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

import connection from "../config/db.js";

class CommentsModel {

    // ✅ Get all sample's comments
    static async fetchPicture_sComments(picture_id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Comments WHERE picture_id = ?");
            stmt.all(picture_id, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ Make Comment
    static async addComment(picture_id, comment_text, comment_owner) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("INSERT INTO Comments (picture_id, comment_text, comment_owner) VALUES (?, ?, ?)");
            stmt.run(picture_id, comment_text, comment_owner, (err) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve({ changes: this.changes, lastID: this.lastID });
            });
        });
    }

    // Remove Comment
    static async removeComment(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("DELETE FROM Comments WHERE id = ?");
            stmt.run(id, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else if (this.changes === 0) reject({ error: "Comment not found" });
                else resolve({ message: "Comment deleted successfully", id });
            });
        });
    }

}

export default CommentsModel;

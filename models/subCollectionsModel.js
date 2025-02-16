import connection from "../config/db.js";

class SubCollectionsModel {
    // ✅ Get all sub-collections for a given collection ID
    static async getAllSubCollections(collectionId) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM SubCollections WHERE collection_id = ? ");
            stmt.all(collectionId, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ Create a new sub-collection
    static async createSubCollection(collectionId, name, description, imageUrl) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("INSERT INTO SubCollections (collection_id, name, description, image) VALUES (?, ?, ?, ?)");
            stmt.run(collectionId, name, description, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else resolve({ id: this.lastID, collectionId, name, description, imageUrl });
            });
        });
    }

    // ✅ Edit an existing sub-collection
    static async editSubCollection(id, name, description) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("UPDATE SubCollections SET name = ?, description = ? WHERE id = ?");
            stmt.run(name, description, id, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else if (this.changes === 0) reject({ error: "Sub-collection not found" });
                else resolve({ message: "Sub-collection updated successfully", id, name, description });
            });
        });
    }

    // ✅ Delete a sub-collection
    static async removeSubCollection(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("DELETE FROM SubCollections WHERE id = ?");
            stmt.run(id, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else if (this.changes === 0) reject({ error: "Sub-collection not found" });
                else resolve({ message: "Sub-collection deleted successfully", id });
            });
        });
    }
}

export default SubCollectionsModel;

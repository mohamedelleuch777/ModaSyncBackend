import connection from '../config/db.js';

class CollectionsModel {

    static async getAllCollections() {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM Collections WHERE 1 ORDER BY id DESC');
            stmt.all((err, rows) => {
                stmt.finalize(); // Close the statement to avoid memory leaks
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async getCollectionById(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM Collections WHERE id = ? ORDER BY id DESC');
            stmt.all(id, (err, rows) => {
                stmt.finalize(); // Close the statement to avoid memory leaks
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    // ✅ Create a New Collection
    static async createCollection(name, description, imageUrl) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("INSERT INTO Collections (name, description, image) VALUES (?, ?, ?)");
            stmt.run(name, description, imageUrl, function (err) {
                stmt.finalize(); // Close statement
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name, description, imageUrl });
                }
            });
        });
    }

    // ✅ Edit an Existing Collection
    static async editCollection(id, name, description) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("UPDATE Collections SET name = ?, description = ? WHERE id = ?");
            stmt.run(name, description, id, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else if (this.changes === 0) reject({ error: "Collection not found" });
                else resolve({ message: "Collection updated successfully", id, name, description });
            });
        });
    }

    // ✅ Remove a Collection
    static async removeCollection(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("DELETE FROM Collections WHERE id = ?");
            stmt.run(id, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else if (this.changes === 0) reject({ error: "Collection not found" });
                else resolve({ message: "Collection deleted successfully", id });
            });
        });
    }

    
}

export default CollectionsModel;

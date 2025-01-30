import connection from '../config/db.js';

class CollectionsModel {

    static async getAllCollections() {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM Collections WHERE 1');
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

    // ✅ Create a New Collection
    static async createCollection(name, description) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("INSERT INTO Collections (name, description) VALUES (?, ?)");
            stmt.run(name, description, function (err) {
                stmt.finalize(); // Close statement
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name, description });
                }
            });
        });
    }

    
}

export default CollectionsModel;

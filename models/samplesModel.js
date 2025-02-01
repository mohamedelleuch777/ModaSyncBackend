import connection from "../config/db.js";

class SamplesModel {
    // ✅ Get all samples for a given subcollection ID
    static async getAllSamples(subcollectionId) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Samples WHERE subcollection_id = ?");
            stmt.all(subcollectionId, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ Create a new sample
    static async createSample(subcollectionId) {
        return new Promise((resolve, reject) => {

            const stmt = connection.prepare("INSERT INTO Samples (subcollection_id) VALUES (?)");
            stmt.run(subcollectionId, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else {
                    const stmt = connection.prepare("INSERT INTO Timeline (sample_id, status) VALUES (?, ?)");
                    stmt.run(subcollectionId, 'new', function (err) {
                        stmt.finalize();
                        if (err) reject(err);
                        else {
                            resolve({ id: this.lastID, subcollectionId, 'status': 'new', timestamp: Date.now() });
                        }
                    });
                }
            });
        });
    }

    // ✅ Edit an existing sample
    static async editSample(id, status, timeline) {
        return new Promise((resolve, reject) => {
            const validStatuses = [
                'new', 'in_review', 'external_task', 'production', 'testing', 
                'accepted', 'rejected', 'readjustment', 'cut_phase', 'preparing_traces', 'ready'
            ];

            if (!validStatuses.includes(status)) {
                return reject({ error: "Invalid status provided" });
            }

            const stmt = connection.prepare("UPDATE Samples SET status = ?, timeline = ? WHERE id = ?");
            stmt.run(status, JSON.stringify(timeline || []), id, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else if (this.changes === 0) reject({ error: "Sample not found" });
                else resolve({ message: "Sample updated successfully", id, status, timeline });
            });
        });
    }

    // ✅ Remove a sample
    static async removeSample(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("DELETE FROM Samples WHERE id = ?");
            stmt.run(id, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else if (this.changes === 0) reject({ error: "Sample not found" });
                else resolve({ message: "Sample deleted successfully", id });
            });
        });
    }
}

export default SamplesModel;

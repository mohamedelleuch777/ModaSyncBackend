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

    // ✅ Get active samples
    static async getActiveSamples() {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Samples WHERE isActive = 'true' ");
            stmt.all((err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ Create a new sample
    static async createSample(subcollectionId, name, imageUrl) {
        return new Promise((resolve, reject) => {

            const stmt = connection.prepare("INSERT INTO Samples (subcollection_id, name, image) VALUES (?, ?, ?)");
            stmt.run(subcollectionId, name, imageUrl, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else {
                    const lastCreatedSample = this.lastID;
                    const stmt = connection.prepare("INSERT INTO Timeline (sample_id, status) VALUES (?, ?)");
                    stmt.run(lastCreatedSample, 'new', function (err) {
                        stmt.finalize();
                        if (err) reject(err);
                        else {
                            resolve({ id: this.lastID, lastCreatedSample, 'status': 'new', timestamp: Date.now() });
                        }
                    });
                }
            });
        });
    }

    // ✅ Edit an existing sample
    static async editSample(sample_id, status) {
        return new Promise( async(resolve, reject) => {
            const validStatuses = [
                'new',                  // responsable: stylist
                'in_review',            // responsable: Manager
                'in_development',       // responsable: Modelist
                'development_done',     // responsable: Stylist
                'external_task',        // responsable: Stylist
                'in_production',        // responsable: ExecutiveWorker
                'testing',              // responsable: Tester
                'accepted',             // responsable: Modelist
                'rejected',             // responsable: isActive = false
                'readjustment',         // responsable: Modelist
                'cut_phase',            // responsable: Modelist
                'preparing_traces',     // responsable: Modelist
                'ready'                 // responsable: isActive = false
            ];

            if (!validStatuses.includes(status)) {
                return reject({ message: "Invalid status provided" });
            }

            if (status === (await this.getLastSampleTimeline(sample_id)).status) {
                return reject({ message: "Sample is already in this status" });
            }

            const stmt = connection.prepare("INSERT INTO Timeline (sample_id, status) VALUES (?, ?)");
            stmt.run(sample_id, status, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else if (this.changes === 0) reject({ message: "Sample not found" });
                else resolve({ message: "Sample updated successfully", sample_id, status });
            });
        });
    }

    // ✅ Get last sample's timeline
    static async getLastSampleTimeline(sample_id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Timeline WHERE sample_id = ? ORDER BY timestamp DESC LIMIT 1");
            stmt.all(sample_id, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    // ✅ Get all sample's timeline
    static async getAllSampleTimeline(sample_id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Timeline WHERE sample_id = ? ORDER BY timestamp DESC");
            stmt.all(sample_id, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ Get sample by ID
    static async getSampleById(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Samples WHERE id = ?");
            stmt.all(id, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    // ✅ Get all images that belog to this sample by ID
    static async getAllImagesBelongingToSample(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Pictures WHERE sample_id = ?");
            stmt.all(id, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
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

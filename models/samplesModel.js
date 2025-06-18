import connection from "../config/db.js";
import exportedFunctions from "../middlewares/authMiddlewares.js";

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
    static async createSample(subcollectionId, name, imageUrl, currentUserID) {
        return new Promise((resolve, reject) => {

            const stmt = connection.prepare("INSERT INTO Samples (subcollection_id, name, image) VALUES (?, ?, ?)");
            stmt.run(subcollectionId, name, imageUrl, function (err) {
                stmt.finalize();
                if (err) reject(err);
                else {
                    const lastCreatedSample = this.lastID;
                    const stmt = connection.prepare("INSERT INTO Timeline (sample_id, status, user_id) VALUES (?, ?, ?)");
                    stmt.run(lastCreatedSample, 'new', currentUserID, function (err) {
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
    static async editSample(sample_id, status, comment, currentUserID) {
        return new Promise( async(resolve, reject) => {
            const validStatuses = [
                'new',                  // responsable: stylist
                'edit',                 // responsable: stylist
                'in_review',            // responsable: Manager
                'in_development',       // responsable: Modelist
                'development_done',     // responsable: Stylist
                'external_task',        // responsable: Stylist
                'external_task_done',   // responsable: Stylist
                'in_production',        // responsable: ExecutiveWorker
                'testing',              // responsable: Tester
                'getting_prod_info',    // responsable: ProductionResponsible
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

            const stmt = connection.prepare("INSERT INTO Timeline (sample_id, status, comment, user_id) VALUES (?, ?, ?, ?)");
            stmt.run(sample_id, status, comment, currentUserID, function (err) {
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

    // ✅ Set sample dimensions
    static async setSampleDimensions(sampleId, width, height, id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare(`
                UPDATE Samples 
                SET sample_width = ?, sample_height = ?, sample_id_dimension = ? 
                WHERE id = ?
            `);
            stmt.run(width, height, id, sampleId, function (err) {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject({ error: "Sample not found" });
                } else {
                    resolve({ 
                        message: "Sample dimensions updated successfully", 
                        sampleId,
                        dimensions: { width, height, id }
                    });
                }
            });
        });
    }

    // ✅ Get sample dimensions
    static async getSampleDimensions(sampleId) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare(`
                SELECT sample_width as width, sample_height as height, sample_id_dimension as id 
                FROM Samples 
                WHERE id = ?
            `);
            stmt.get(sampleId, (err, row) => {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else {
                    resolve(row || { width: null, height: null, id: null });
                }
            });
        });
    }
}

export default SamplesModel;

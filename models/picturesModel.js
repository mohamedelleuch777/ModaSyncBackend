import connection from "../config/db.js";

class PicturesModel {

    // ✅ Get all sample's pictures
    static async fetchPictures(sampleId) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Pictures WHERE sample_id = ?");
            stmt.all(sampleId, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ Add pictures to sample
    static async addPictures(sampleId, title, imageUrl) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("INSERT INTO Pictures (sample_id, title, image_url) VALUES (?, ?, ?)");
            stmt.all(sampleId, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ Delete a picture
    static async deletePicture(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("DELETE FROM Pictures WHERE id = ?");
            stmt.all(id, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

}

export default PicturesModel;

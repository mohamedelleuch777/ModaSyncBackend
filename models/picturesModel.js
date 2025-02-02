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
    static async addPictures(sampleId, title, imageUrl, imagePath) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("INSERT INTO Pictures (sample_id, title, image_url, image_path) VALUES (?, ?, ?, ?)");
            stmt.all(sampleId, title, imageUrl, imagePath, (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve({ message: "Picture added successfully", imageUrl: imageUrl });
            });
        });
    }

    // ✅ Delete a picture
    static async deletePicture(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("DELETE FROM Pictures WHERE id = ? RETURNING *");
            stmt.all(id, function(err, rows) {
              stmt.finalize();
              if (err) {
                reject(err);
              } else {
                const deletedItem = rows[0];
                resolve({changes: this.changes, deletedItem: deletedItem}); // 'this.changes' contains the number of rows deleted
              }
            });
        });
    }

}

export default PicturesModel;

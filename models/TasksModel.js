import connection from "../config/db.js";

class TasksModel {

    // ✅ Get all sample's Tasks
    static async fetchAllTimelines() {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare("SELECT * FROM Timeline WHERE TRUE");
            stmt.all( (err, rows) => {
                stmt.finalize();
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

export default TasksModel;

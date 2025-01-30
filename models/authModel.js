import connection from '../config/db.js';

class AuthsModel {
    static async createUser(name, email, phone, password, role) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)');
            stmt.run(name, email, phone, password, role, (err) => {
                if (err) reject(err);
                else resolve({ id: this.lastID, name, email, phone });
            });
        });
    }

    static async getUserByEmail(email, keepPassword = false) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM users WHERE email = ?');
            stmt.all(email, (err, rows) => {
                stmt.finalize(); // Close the statement to avoid memory leaks
                if (err) {
                    reject(err);
                } else {
                    if(keepPassword) {
                        resolve(rows[0]);
                    } else {
                        // Remove passwords from each user object
                        const sanitizedRows = rows.map(({ password, ...user }) => user);
                        resolve(sanitizedRows[0]);
                    }
                }
            });
        });
    }

    static async getUserByPhone(phone, keepPassword = false) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM users WHERE phone = ?');
            stmt.all(phone, (err, rows) => {
                stmt.finalize(); // Close the statement to avoid memory leaks
                if (err) {
                    reject(err);
                } else {
                    if(keepPassword) {
                        resolve(rows[0]);
                    } else {
                        // Remove passwords from each user object
                        const sanitizedRows = rows.map(({ password, ...user }) => user);
                        resolve(sanitizedRows[0]);
                    }
                }
            });
        });
    }

}

export default AuthsModel;

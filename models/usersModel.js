import connection from '../config/db.js';

class UsersModel {
    static async createUser(name, email, phone, password, role) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)');
            stmt.run(name, email, phone, password, role, (err) => {
                if (err) reject(err);
                else resolve({ id: this.lastID, name, email, phone });
            });
        });
    }

    static async getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM users WHERE email = ?');
            stmt.all(email, (err, rows) => {
                stmt.finalize(); // Close the statement to avoid memory leaks
                if (err) {
                    reject(err);
                } else {
                    // Remove passwords from each user object
                    const sanitizedRows = rows.map(({ password, ...user }) => user);
                    resolve(sanitizedRows[0]);
                }
            });
        });
    }

    static async getUserByPhone(phone) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM users WHERE phone = ?');
            stmt.all(phone, (err, rows) => {
                stmt.finalize(); // Close the statement to avoid memory leaks
                if (err) {
                    reject(err);
                } else {
                    // Remove passwords from each user object
                    const sanitizedRows = rows.map(({ password, ...user }) => user);
                    resolve(sanitizedRows[0]);
                }
            });
        });
    }

    static async getAllUsers() {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM users WHERE 1');
            stmt.all((err, rows) => {
                stmt.finalize(); // Close the statement to avoid memory leaks
                if (err) {
                    reject(err);
                } else {
                    // Remove passwords from each user object
                    const sanitizedRows = rows.map(({ password, ...user }) => user);
                    resolve(sanitizedRows);
                }
            });
        });
    }

    static async deleteUserById(userId) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('DELETE FROM users WHERE id = ?');
            stmt.run(userId, function (err) {
                stmt.finalize(); // Close statement
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null); // No user found
                } else {
                    resolve({ message: "User deleted successfully" });
                }
            });
        });
    }

    static async updateUserById(userId, name, email, phone) {
        return new Promise(async (resolve, reject) => {
            const updates = [];
            const params = [];
    
            if (name) {
                updates.push("name = ?");
                params.push(name);
            }
            if (email) {
                updates.push("email = ?");
                params.push(email);
            }
            if (phone) {
                updates.push("phone = ?");
                params.push(phone);
            }    
            if (updates.length === 0) {
                return resolve(null); // No updates provided
            }
    
            params.push(userId);
    
            const stmt = connection.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`);
            stmt.run(params, function (err) {
                stmt.finalize(); // Close statement
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null); // No user found
                } else {
                    resolve({ message: "User updated successfully" });
                }
            });
        });
    }

    static updateUserRole = (userId, newRole, callback) => {
        const stmt = connection.prepare("UPDATE users SET role = ? WHERE id = ?");
    
        stmt.run(newRole, userId, function (err) {
            stmt.finalize(); // Close statement to prevent memory leaks
    
            if (err) {
                return callback(err, null);
            }
    
            if (this.changes === 0) {
                return callback(null, { error: "User not found" });
            }
    
            callback(null, { message: "User role updated successfully", userId, newRole });
        });
    };
    
}

export default UsersModel;

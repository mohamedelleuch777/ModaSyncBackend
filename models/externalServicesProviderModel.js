import connection from '../config/db.js';

class ExternalServicesProviderModel {
    static async getAllProviders() {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM ExternalServicesProvider ORDER BY name');
            stmt.all((err, rows) => {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else {
                    // Convert SQLite INTEGER (0/1) to JavaScript boolean
                    const providers = rows.map(row => ({
                        ...row,
                        active: Boolean(row.active)
                    }));
                    resolve(providers);
                }
            });
        });
    }

    static async getProviderById(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM ExternalServicesProvider WHERE id = ?');
            stmt.get(id, (err, row) => {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else if (row) {
                    // Convert SQLite INTEGER (0/1) to JavaScript boolean
                    const provider = {
                        ...row,
                        active: Boolean(row.active)
                    };
                    resolve(provider);
                } else {
                    resolve(null);
                }
            });
        });
    }

    static async createProvider(name, phone, active = true) {
        return new Promise((resolve, reject) => {
            // Convert boolean to INTEGER (0/1) for SQLite
            const activeInt = active ? 1 : 0;
            const stmt = connection.prepare('INSERT INTO ExternalServicesProvider (name, phone, active) VALUES (?, ?, ?)');
            stmt.run(name, phone, activeInt, function(err) {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        name, 
                        phone, 
                        active 
                    });
                }
            });
        });
    }

    static async updateProvider(id, name, phone, active) {
        return new Promise((resolve, reject) => {
            // Convert boolean to INTEGER (0/1) for SQLite
            const activeInt = active ? 1 : 0;
            const stmt = connection.prepare('UPDATE ExternalServicesProvider SET name = ?, phone = ?, active = ? WHERE id = ?');
            stmt.run(name, phone, activeInt, id, function(err) {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null); // No rows updated
                } else {
                    resolve({ 
                        id, 
                        name, 
                        phone, 
                        active 
                    });
                }
            });
        });
    }

    static async updateProviderStatus(id, active) {
        return new Promise((resolve, reject) => {
            // Convert boolean to INTEGER (0/1) for SQLite
            const activeInt = active ? 1 : 0;
            const stmt = connection.prepare('UPDATE ExternalServicesProvider SET active = ? WHERE id = ?');
            stmt.run(activeInt, id, function(err) {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null); // No rows updated
                } else {
                    resolve({ 
                        id, 
                        active 
                    });
                }
            });
        });
    }

    static async deleteProvider(id) {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('DELETE FROM ExternalServicesProvider WHERE id = ?');
            stmt.run(id, function(err) {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null); // No rows deleted
                } else {
                    resolve({ id });
                }
            });
        });
    }

    static async getActiveProviders() {
        return new Promise((resolve, reject) => {
            const stmt = connection.prepare('SELECT * FROM ExternalServicesProvider WHERE active = 1 ORDER BY name');
            stmt.all((err, rows) => {
                stmt.finalize();
                if (err) {
                    reject(err);
                } else {
                    // Convert SQLite INTEGER (0/1) to JavaScript boolean
                    const providers = rows.map(row => ({
                        ...row,
                        active: Boolean(row.active)
                    }));
                    resolve(providers);
                }
            });
        });
    }
}

export default ExternalServicesProviderModel;
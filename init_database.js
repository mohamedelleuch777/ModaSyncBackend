import DuckDB from "duckdb";
import FS from "fs";

console.log("Initializing database...");

// Ensure the directory exists
if (!FS.existsSync("../database")) {
    FS.mkdirSync("../database", { recursive: true });
}

// Initialize DuckDB and keep a persistent connection
const db = new DuckDB.Database("../database/database.duckdb");

console.log(db)

// Ensure table exists
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        name TEXT,
        email TEXT UNIQUE
    )
`);
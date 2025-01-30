// import DuckDB from "duckdb";
import sqlite3 from "sqlite3";
import { DB_PATH } from "./env.js";

// const db = new DuckDB.Database("../database/database.duckdb"); // Persistent storage
// const connection = db.connect();

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("❌ Error opening SQLite database:", err.message);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

const connection = db;

export default connection;

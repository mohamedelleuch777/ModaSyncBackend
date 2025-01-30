import DuckDB from "duckdb";

const db = new DuckDB.Database("../database/database.duckdb"); // Persistent storage
const connection = db.connect();

export default connection;

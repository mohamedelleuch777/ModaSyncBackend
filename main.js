import 'dotenv/config'
import express from "express";
import DuckDB from "duckdb";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize DuckDB connection
// const db = new DuckDB.Database(":memory:"); // Using in-memory DB (change to a file path for persistence)
const db = new DuckDB.Database("database/database.duckdb");
const connection = db.connect();

// Create a sample table
connection.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        name TEXT,
        email TEXT UNIQUE
    )
`);

// -------------------- API Routes --------------------

// Get all users
app.get("/users", (req, res) => {
    connection.all("SELECT * FROM users", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    connection.all("SELECT * FROM users WHERE id = ?", [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(rows[0]);
    });
});

// Add a new user
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and Email are required" });

    connection.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User added successfully" });
    });
});

// Update a user
app.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;

    connection.run(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, userId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: "User not found" });
            res.json({ message: "User updated successfully" });
        }
    );
});

// Delete a user
app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;

    connection.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    });
});

// ----------------------------------------------------

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

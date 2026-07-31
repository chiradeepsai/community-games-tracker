const sqlite3 = require("sqlite3").verbose();

// Create or open the SQLite database
const db = new sqlite3.Database("./database/community.db", (err) => {
    if (err) {
        console.error("❌ Database Error:", err.message);
    } else {
        console.log("✅ SQLite Connected");

        // Create tables if they don't exist
        db.serialize(() => {

            // Users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    discord_id TEXT UNIQUE,
                    username TEXT
                )
            `);

            // Games table
            db.run(`
                CREATE TABLE IF NOT EXISTS games (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    game_name TEXT UNIQUE
                )
            `);

            // User -> Game relationship
            db.run(`
                CREATE TABLE IF NOT EXISTS user_games (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    game_id INTEGER,
                    FOREIGN KEY(user_id) REFERENCES users(id),
                    FOREIGN KEY(game_id) REFERENCES games(id)
                )
            `);

            console.log("✅ Database Tables Ready");
        });
    }
});

module.exports = db;
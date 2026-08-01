const sqlite3 = require("sqlite3").verbose();

// Create/Open Database
const db = new sqlite3.Database("./database/community.db", (err) => {

    if (err) {

        console.error("❌ Database Error:", err.message);

    } else {

        console.log("✅ SQLite Connected");

        db.serialize(() => {

            // ==========================
            // USERS
            // ==========================

            db.run(`
                CREATE TABLE IF NOT EXISTS users (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    discord_id TEXT UNIQUE,

                    username TEXT

                )
            `);

            // ==========================
            // GAMES
            // ==========================

            db.run(`
                CREATE TABLE IF NOT EXISTS games (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    rawg_id INTEGER UNIQUE,

                    game_name TEXT

                )
            `);

            // ==========================
            // USER GAMES
            // ==========================

            db.run(`
                CREATE TABLE IF NOT EXISTS user_games (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    user_id INTEGER,

                    game_id INTEGER,

                    FOREIGN KEY(user_id) REFERENCES users(id),

                    FOREIGN KEY(game_id) REFERENCES games(id)

                )
            `);

            // ==========================
            // COMMUNITY HUB
            // ==========================

            db.run(`
                CREATE TABLE IF NOT EXISTS community_hub (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    guild_id TEXT UNIQUE,

                    channel_id TEXT,

                    message_id TEXT

                )
            `);

            console.log("✅ Database Tables Ready");

        });

    }

});

module.exports = db;
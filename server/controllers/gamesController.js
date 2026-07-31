const axios = require("axios");
const db = require("../../database/database");

async function searchGames(req, res) {

    try {

        const response = await axios.get("https://api.rawg.io/api/games", {
            params: {
                key: process.env.RAWG_API_KEY,
                search: req.query.q,
                page_size: 10
            }
        });

        res.json(
            response.data.results.map(game => ({
                id: game.id,
                name: game.name
            }))
        );

    } catch (err) {

        console.log(err.message);

        res.status(500).json({
            error: "Search failed"
        });

    }

}

async function saveGames(req, res) {

    const games = req.body.games;

    // Temporary user until Discord login is added
    const username = "testuser";

    db.serialize(() => {

        // Create user if not exists
        db.run(
            `INSERT OR IGNORE INTO users(username) VALUES(?)`,
            [username]
        );

        // Get user id
        db.get(
            `SELECT id FROM users WHERE username = ?`,
            [username],
            (err, user) => {

                if (err) {
                    console.log(err);
                    return;
                }

                // Delete old games (Option A)
                db.run(
                    `DELETE FROM user_games WHERE user_id = ?`,
                    [user.id]
                );

                games.forEach(game => {

                    // Save game if new
                    db.run(
                        `INSERT OR IGNORE INTO games(rawg_id, game_name)
                         VALUES(?, ?)`,
                        [game.id, game.name]
                    );

                    // Get game id
                    db.get(
                        `SELECT id FROM games WHERE rawg_id = ?`,
                        [game.id],
                        (err, dbGame) => {

                            if (err) {
                                console.log(err);
                                return;
                            }

                            // Link user ↔ game
                            db.run(
                                `INSERT INTO user_games(user_id, game_id)
                                 VALUES(?, ?)`,
                                [user.id, dbGame.id]
                            );

                        }
                    );

                });

                res.json({
                    success: true,
                    message: "Games saved successfully!"
                });

            }
        );

    });

}

module.exports = {
    searchGames,
    saveGames
};
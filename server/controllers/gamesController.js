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

        res.json(response.data.results.map(game => ({

            id: game.id,

            name: game.name

        })));

    }

    catch (err) {

        console.log(err.message);

        res.status(500).json({

            error: "Search failed"

        });

    }

}

async function saveGames(req, res) {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,

            message: "Please login with Discord."

        });

    }

    const discordId = req.session.user.discordId;
    const username = req.session.user.username;

    const games = req.body.games;

    db.serialize(() => {

        db.run(

            `INSERT OR IGNORE INTO users(discord_id, username)
             VALUES(?, ?)`,

            [discordId, username]

        );

        db.run(

            `UPDATE users
             SET username = ?
             WHERE discord_id = ?`,

            [username, discordId]

        );

        db.get(

            `SELECT id
             FROM users
             WHERE discord_id = ?`,

            [discordId],

            (err, user) => {

                if (err) {

                    console.log(err);

                    return;

                }

                db.run(

                    `DELETE FROM user_games
                     WHERE user_id = ?`,

                    [user.id]

                );

                games.forEach(game => {

                    db.run(

                        `INSERT OR IGNORE INTO games(rawg_id, game_name)
                         VALUES(?, ?)`,

                        [game.id, game.name]

                    );

                    db.get(

                        `SELECT id
                         FROM games
                         WHERE rawg_id = ?`,

                        [game.id],

                        (err, dbGame) => {

                            if (err) return;

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

                    message: "Games Updated Successfully!"

                });

            }

        );

    });

}

module.exports = {

    searchGames,

    saveGames

};
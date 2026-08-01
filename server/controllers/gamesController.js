const axios = require("axios");
const db = require("../../database/database");

// ==========================
// SEARCH GAMES
// ==========================

async function searchGames(req, res) {

    try {

        const response = await axios.get(
            "https://api.rawg.io/api/games",
            {
                params: {
                    key: process.env.RAWG_API_KEY,
                    search: req.query.q,
                    page_size: 10
                }
            }
        );

        res.json(
            response.data.results.map(game => ({
                id: game.id,
                name: game.name
            }))
        );

    } catch (err) {

        console.error(err.message);

        res.status(500).json({
            error: "Search failed"
        });

    }

}

// ==========================
// SAVE GAMES
// ==========================

async function saveGames(req, res) {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,

            message: "Please login with Discord."

        });

    }

    const discordId = req.session.user.discordId;
    const username = req.session.user.username;

    const {

        guildId,

        guildName,

        games

    } = req.body;

    if (!guildId || !guildName) {

        return res.status(400).json({

            success: false,

            message: "Missing server information."

        });

    }

    db.serialize(() => {

        db.run(

            `INSERT OR IGNORE INTO users
            (
                discord_id,
                username,
                guild_id,
                guild_name
            )
            VALUES (?, ?, ?, ?)`,

            [

                discordId,

                username,

                guildId,

                guildName

            ]

        );

        db.run(

            `UPDATE users
             SET
                username = ?,
                guild_name = ?
             WHERE
                discord_id = ?
             AND
                guild_id = ?`,

            [

                username,

                guildName,

                discordId,

                guildId

            ]

        );

        db.get(

            `SELECT id
             FROM users
             WHERE
                discord_id = ?
             AND
                guild_id = ?`,

            [

                discordId,

                guildId

            ],

            (err, user) => {

                if (err || !user) {

                    console.error(err);

                    return res.status(500).json({

                        success: false,

                        message: "Database Error"

                    });

                }

                db.run(

                    `DELETE FROM user_games
                     WHERE user_id = ?`,

                    [

                        user.id

                    ]

                );

                games.forEach(game => {

                    db.run(

                        `INSERT OR IGNORE INTO games
                        (
                            rawg_id,
                            game_name
                        )
                        VALUES (?, ?)`,

                        [

                            game.id,

                            game.name

                        ]

                    );

                    db.get(

                        `SELECT id
                         FROM games
                         WHERE rawg_id = ?`,

                        [

                            game.id

                        ],

                        (err, dbGame) => {

                            if (err || !dbGame) return;

                            db.run(

                                `INSERT INTO user_games
                                (
                                    user_id,
                                    game_id
                                )
                                VALUES (?, ?)`,

                                [

                                    user.id,

                                    dbGame.id

                                ]

                            );

                        }

                    );

                });

                res.json({

                    success: true,

                    message: `Games updated for ${guildName}!`

                });

            }

        );

    });

}

module.exports = {

    searchGames,

    saveGames

};
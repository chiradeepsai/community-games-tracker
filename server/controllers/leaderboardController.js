const db = require("../../database/database");

// ==========================
// TOP GAMES
// ==========================

function getTopGames(req, res) {

    db.all(

        `SELECT
            games.game_name,
            COUNT(user_games.game_id) AS players

        FROM user_games

        JOIN games
            ON games.id = user_games.game_id

        GROUP BY games.id

        ORDER BY players DESC,
                 games.game_name ASC

        LIMIT 5`,

        [],

        (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            res.json({
                success: true,
                games: rows
            });

        }

    );

}

// ==========================
// FIND PLAYERS
// ==========================

function findPlayers(req, res) {

    db.all(

        `SELECT
            games.game_name,
            users.username

        FROM user_games

        JOIN users
            ON users.id = user_games.user_id

        JOIN games
            ON games.id = user_games.game_id

        ORDER BY
            games.game_name ASC,
            users.username ASC`,

        [],

        (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            res.json({
                success: true,
                players: rows
            });

        }

    );

}

module.exports = {

    getTopGames,

    findPlayers

};
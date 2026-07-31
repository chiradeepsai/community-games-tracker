const db = require("../../database/database");

function getTopGames(req, res) {

    db.all(

        `SELECT
            games.game_name,
            COUNT(user_games.game_id) AS players

        FROM user_games

        JOIN games
            ON games.id = user_games.game_id

        GROUP BY games.id

        ORDER BY players DESC

        LIMIT 5`,

        [],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Database Error"
                });

            }

            res.json(rows);

        }

    );

}

module.exports = {
    getTopGames
};
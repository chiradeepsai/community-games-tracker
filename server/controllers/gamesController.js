const axios = require("axios");

async function saveGames(req, res) {

    console.log("Received:");
    console.log(req.body);

    res.json({
        success: true,
        message: "Games received!"
    });

}

async function searchGames(req, res) {

    try {

        const query = req.query.q;

        const response = await axios.get("https://api.rawg.io/api/games", {
            params: {
                key: process.env.RAWG_API_KEY,
                search: query,
                page_size: 10
            }
        });

        const games = response.data.results.map(game => ({
            id: game.id,
            name: game.name,
            image: game.background_image
        }));

        res.json(games);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            error: "Failed to search games"
        });

    }

}

module.exports = {
    saveGames,
    searchGames
};
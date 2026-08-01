const axios = require("axios");

const BASE_URL =
    process.env.BASE_URL || "http://localhost:3000";

// ==========================
// TOP GAMES
// ==========================

async function getTopGames(guildId) {

    try {

        const response = await axios.get(
            `${BASE_URL}/api/top-games`,
            {
                params: {
                    guildId
                }
            }
        );

        return response.data.games;

    } catch (err) {

        console.error("❌ Leaderboard Error:", err.message);

        return [];

    }

}

// ==========================
// FIND PLAYERS
// ==========================

async function getPlayers(guildId) {

    try {

        const response = await axios.get(
            `${BASE_URL}/api/find-players`,
            {
                params: {
                    guildId
                }
            }
        );

        return response.data.players;

    } catch (err) {

        console.error("❌ Find Players Error:", err.message);

        return [];

    }

}

module.exports = {

    getTopGames,

    getPlayers

};
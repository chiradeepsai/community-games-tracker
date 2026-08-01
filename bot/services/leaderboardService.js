const axios = require("axios");

const BASE_URL =
    process.env.BASE_URL || "http://localhost:3000";

// ==========================
// TOP GAMES
// ==========================

async function getTopGames() {

    try {

        const response = await axios.get(
            `${BASE_URL}/api/top-games`
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

async function getPlayers() {

    try {

        const response = await axios.get(
            `${BASE_URL}/api/find-players`
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
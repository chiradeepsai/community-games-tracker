const express = require("express");

const router = express.Router();

const {
    getTopGames,
    findPlayers
} = require("../controllers/leaderboardController");

// Top 5 Games
router.get("/top-games", getTopGames);

// Find Players
router.get("/find-players", findPlayers);

module.exports = router;
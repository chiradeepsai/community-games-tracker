const express = require("express");

const router = express.Router();

const {
    getTopGames
} = require("../controllers/leaderboardController");

router.get("/top-games", getTopGames);

module.exports = router;
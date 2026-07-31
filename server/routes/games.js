const express = require("express");

const router = express.Router();

const {
    saveGames,
    searchGames
} = require("../controllers/gamesController");

router.post("/save-games", saveGames);

router.get("/search-games", searchGames);

module.exports = router;
const express = require("express");

const router = express.Router();

const controller = require("../controllers/gamesController");

console.log(controller);

router.post("/save-games", controller.saveGames);

router.get("/search-games", controller.searchGames);

module.exports = router;
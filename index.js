require("dotenv").config();

const db = require("./database/database");

const express = require("express");

const {
    Client,
    GatewayIntentBits,
    Events
} = require("discord.js");

const gamesRoutes = require("./server/routes/games");

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.use("/api", gamesRoutes);

const client = new Client({

    intents: [
        GatewayIntentBits.Guilds
    ]

});

client.once(Events.ClientReady, (client) => {

    console.log(`✅ Discord Bot Online (${client.user.tag})`);

});

client.login(process.env.DISCORD_TOKEN);

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/public/index.html");

});

app.listen(3000, () => {

    console.log("🌐 Website Running");

    console.log("http://localhost:3000");

});
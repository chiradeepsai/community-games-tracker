require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("./server/config/passport");

require("./database/database");

const {
    Client,
    GatewayIntentBits,
    Events
} = require("discord.js");

const gamesRoutes = require("./server/routes/games");
const leaderboardRoutes = require("./server/routes/leaderboard");
const authRoutes = require("./server/routes/auth");

// Discord Interaction Handler
const interactionCreate = require("./bot/events/interactionCreate");

const app = express();

// ==========================
// Middleware
// ==========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
    session({
        secret: "community-games-secret",
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

// ==========================
// Routes
// ==========================

app.use("/api", gamesRoutes);
app.use("/api", leaderboardRoutes);
app.use("/auth", authRoutes);

// ==========================
// Discord Bot
// ==========================

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (client) => {

    console.log(`✅ Discord Bot Online (${client.user.tag})`);

});

// Handle Slash Commands & Buttons
client.on(Events.InteractionCreate, interactionCreate);

client.login(process.env.DISCORD_TOKEN);

// ==========================
// Website
// ==========================

app.listen(3000, () => {

    console.log("🌐 Website Running");
    console.log("http://localhost:3000");

});
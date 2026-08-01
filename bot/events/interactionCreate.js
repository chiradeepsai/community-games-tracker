const {
    EmbedBuilder
} = require("discord.js");

const setupCommunity = require("../commands/setupCommunity");
const {
    getTopGames,
    getPlayers
} = require("../services/leaderboardService");

module.exports = async (interaction) => {

    // ==========================
    // Slash Commands
    // ==========================

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "setup-community-games") {

            return setupCommunity.execute(interaction);

        }

    }

    // ==========================
    // Buttons
    // ==========================

    if (interaction.isButton()) {

        switch (interaction.customId) {

            // ==========================
            // LEADERBOARD
            // ==========================

            case "leaderboard": {

                const topGames = await getTopGames();

                let description = "No games submitted yet.";

                if (topGames.length > 0) {

                    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

                    description = topGames
                        .slice(0, 5)
                        .map((game, index) =>
                            `${medals[index]} **${game.game_name}** — ${game.players} Player${game.players > 1 ? "s" : ""}`
                        )
                        .join("\n");

                }

                const leaderboardEmbed = new EmbedBuilder()

                    .setColor("#FFD700")

                    .setTitle("🏆 Community Leaderboard")

                    .setDescription(description)

                    .setFooter({

                        text: "Community Games Tracker"

                    })

                    .setTimestamp();

                await interaction.reply({

                    embeds: [leaderboardEmbed],

                    ephemeral: true

                });

                break;

            }

            // ==========================
            // FIND PLAYERS
            // ==========================

            case "players": {

                const players = await getPlayers();

                if (players.length === 0) {

                    await interaction.reply({

                        content: "No players have shared their games yet.",

                        ephemeral: true

                    });

                    return;

                }

                const grouped = {};

                players.forEach(player => {

                    if (!grouped[player.game_name]) {

                        grouped[player.game_name] = [];

                    }

                    grouped[player.game_name].push(player.username);

                });

                let description = "";

                Object.keys(grouped).forEach(game => {

                    description += `🎮 **${game}**\n`;

                    grouped[game].forEach(username => {

                        description += `• ${username}\n`;

                    });

                    description += "\n";

                });

                const playersEmbed = new EmbedBuilder()

                    .setColor("#57F287")

                    .setTitle("👥 Community Players")

                    .setDescription(description)

                    .setFooter({

                        text: "Community Games Tracker"

                    })

                    .setTimestamp();

                await interaction.reply({

                    embeds: [playersEmbed],

                    ephemeral: true

                });

                break;

            }

        }

    }

};
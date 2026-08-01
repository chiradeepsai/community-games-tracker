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

        const guildId = interaction.guild.id;

        switch (interaction.customId) {

            // ==========================
            // LEADERBOARD
            // ==========================

            case "leaderboard": {

                const topGames = await getTopGames(guildId);

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

                    .setTitle(`🏆 ${interaction.guild.name}`)

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

                const players = await getPlayers(guildId);

                if (players.length === 0) {

                    return interaction.reply({

                        content: "No players have shared their games yet.",

                        ephemeral: true

                    });

                }

                const grouped = {};

                players.forEach(player => {

                    if (!grouped[player.game_name]) {

                        grouped[player.game_name] = [];

                    }

                    grouped[player.game_name].push(player.username);

                });

                let description = "";

                Object.entries(grouped).forEach(([game, users]) => {

                    description += `🎮 **${game}**\n`;

                    users.forEach(user => {

                        description += `• ${user}\n`;

                    });

                    description += "\n";

                });

                const playersEmbed = new EmbedBuilder()

                    .setColor("#57F287")

                    .setTitle(`👥 ${interaction.guild.name}`)

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
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function buildCommunityHub(guildId, guildName, topGames = []) {

    let leaderboard = "No games submitted yet.\n\nBe the first to update your games!";

    if (topGames.length > 0) {

        const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

        leaderboard = topGames
            .slice(0, 5)
            .map((game, index) => {

                const players = Number(game.players);

                return `${medals[index]} **${game.game_name}**
👥 ${players} Player${players === 1 ? "" : "s"}`;

            })
            .join("\n\n");

    }

    const websiteUrl =
        `https://community-games-tracker.onrender.com/?guildId=${guildId}&guildName=${encodeURIComponent(guildName)}`;

    const embed = new EmbedBuilder()

        .setColor("#5865F2")

        .setTitle("🎮 Community Games Hub")

        .setDescription(
`Looking for teammates?

Keep your games updated so everyone in the community can quickly find people to play with.

━━━━━━━━━━━━━━━━━━━━━━

🏆 **Trending Games**

${leaderboard}

━━━━━━━━━━━━━━━━━━━━━━

👇 Use the buttons below to update your games, view the leaderboard or find other players.

⭐ Tip: Update your games every few days so the community stays current.`
        )

        .setFooter({

            text: "Community Games Tracker"

        })

        .setTimestamp();

    const row = new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

                .setLabel("🎮 Update My Games")

                .setStyle(ButtonStyle.Link)

                .setURL(websiteUrl),

            new ButtonBuilder()

                .setCustomId("leaderboard")

                .setLabel("🏆 Leaderboard")

                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()

                .setCustomId("players")

                .setLabel("👥 Find Players")

                .setStyle(ButtonStyle.Success)

        );

    return {

        embeds: [embed],

        components: [row]

    };

}

module.exports = {

    buildCommunityHub

};
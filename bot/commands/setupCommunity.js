const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const db = require("../../database/database");
const { buildCommunityHub } = require("../embeds/communityHub");
const { getTopGames } = require("../services/leaderboardService");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("setup-community-games")
        .setDescription("Creates the Community Games Hub")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const guildId = interaction.guild.id;
        const guildName = interaction.guild.name;

        db.get(
            "SELECT * FROM community_hub WHERE guild_id = ?",
            [guildId],
            async (err, existingHub) => {

                if (err) {

                    console.error(err);

                    return interaction.reply({
                        content: "❌ Database error.",
                        ephemeral: true
                    });

                }

                if (existingHub) {

                    return interaction.reply({
                        content: "⚠️ Community Games Hub already exists in this server.",
                        ephemeral: true
                    });

                }

                await interaction.deferReply({ ephemeral: true });

                const topGames = await getTopGames(guildId);

                const hub = buildCommunityHub(
                    guildId,
                    guildName,
                    topGames
                );

                const message = await interaction.channel.send(hub);

                try {

                    await message.pin();

                } catch (e) {

                    console.log("Couldn't pin message.");

                }

                db.run(
                    `INSERT INTO community_hub
                    (guild_id, guild_name, channel_id, message_id)
                    VALUES (?, ?, ?, ?)`,
                    [
                        guildId,
                        guildName,
                        interaction.channel.id,
                        message.id
                    ]
                );

                await interaction.editReply({
                    content: "✅ Community Games Hub created and pinned successfully!"
                });

            }
        );

    }

};
const db = require("../../database/database");

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


function startReminderScheduler(client) {

    console.log("⏰ Reminder Scheduler Started");


    // TEST MODE
    // Sends reminder every 2 minutes

    setInterval(() => {

        sendReminders(client);

    }, 48 * 60 * 1000);

}


// ==========================
// SEND REMINDERS
// ==========================

function sendReminders(client) {

    db.all(

        `SELECT
            guild_id,
            channel_id,
            guild_name

         FROM community_hub`,

        [],

        async (err, rows) => {

            if (err) {

                console.error(
                    "Reminder DB Error:",
                    err
                );

                return;

            }


            for (const server of rows) {

                try {

                    const channel = await client.channels.fetch(
                        server.channel_id
                    );


                    if (!channel) {

                        continue;

                    }


                    const row = new ActionRowBuilder()
                        .addComponents(

                            new ButtonBuilder()

                                .setLabel("🎮 Update My Games")

                                .setStyle(ButtonStyle.Link)

                                .setURL(
                                    "https://community-games-tracker.onrender.com"
                                )

                        );


                    await channel.send({

                        content:
`🎮 **Community Gaming Reminder**

Looking for teammates?

Update the games you play and let your community know!

👇 Click **Update My Games** below:

1️⃣ Login with Discord  
2️⃣ Select up to 3 games you play  
3️⃣ Save your choices  

Your games will appear in the community leaderboard and player list.

Let's find people to play with! 🎮`,

                        components: [row]

                    });


                    console.log(
                        `✅ Reminder sent to ${server.guild_name}`
                    );


                } catch (error) {

                    console.error(
                        "Reminder Send Error:",
                        error.message
                    );

                }

            }

        }

    );

}


module.exports = startReminderScheduler;
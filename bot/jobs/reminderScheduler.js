const db = require("../../database/database");

function startReminderScheduler(client) {

    console.log("⏰ Reminder Scheduler Started");


    // TEST MODE
    // Sends reminder every 10 minutes

    setInterval(() => {

        sendReminders(client);

    }, 10 * 60 * 1000);


    // Optional immediate test after bot starts
    // Remove later if not needed

    // sendReminders(client);

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


                    await channel.send({

                        content:
`🎮 **Community Gaming Reminder**

What are you playing?

Update your games and find teammates!

👇 Use the Community Games Hub buttons to join the fun.`

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
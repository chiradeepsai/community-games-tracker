const express = require("express");
const passport = require("passport");

const router = express.Router();


// ==========================
// DISCORD LOGIN
// ==========================

router.get(
    "/discord",
    (req, res, next) => {

        // Save server context before OAuth redirect
        req.session.guildContext = {

            guildId: req.query.guildId || null,

            guildName: req.query.guildName || null

        };

        next();

    },
    passport.authenticate("discord")
);


// ==========================
// DISCORD CALLBACK
// ==========================

router.get(
    "/discord/callback",
    passport.authenticate("discord", {
        failureRedirect: "/"
    }),
    (req, res) => {


        req.session.user = {

            discordId: req.user.discordId,

            username: req.user.username,

            avatar: req.user.avatar,

            guilds: req.user.guilds || []

        };


        const guild = req.session.guildContext;


        if (guild && guild.guildId) {

            return res.redirect(
                `/?guildId=${guild.guildId}&guildName=${encodeURIComponent(guild.guildName || "")}`
            );

        }


        res.redirect("/");

    }
);


// ==========================
// CURRENT USER
// ==========================

router.get("/me", (req, res) => {


    if (!req.session.user) {

        return res.json({

            loggedIn: false

        });

    }


    res.json({

        loggedIn: true,

        user: req.session.user,

        guild: req.session.guildContext || null

    });


});


// ==========================
// LOGOUT
// ==========================

router.get("/logout", (req, res) => {


    req.logout(() => {

        req.session.destroy(() => {

            res.redirect("/");

        });

    });


});


module.exports = router;
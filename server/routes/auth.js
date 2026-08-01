const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
    "/discord",
    passport.authenticate("discord")
);

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

        user: req.session.user

    });

});

// ==========================
// USER GUILDS
// ==========================

router.get("/guilds", (req, res) => {

    if (!req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Not logged in"
        });

    }

    res.json({

        success: true,

        guilds: req.session.user.guilds || []

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
const express = require("express");
const passport = require("passport");

const router = express.Router();


// ==========================
// DISCORD LOGIN
// ==========================

router.get(
    "/discord",
    (req, res, next) => {

        // Remember where the user came from
        req.session.returnUrl = req.headers.referer || "/";

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


        // Return to original page
        const returnUrl = req.session.returnUrl;


        delete req.session.returnUrl;


        if (returnUrl) {

            return res.redirect(returnUrl);

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
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.REDIRECT_URI,
            scope: ["identify"]
        },

        (accessToken, refreshToken, profile, done) => {

            return done(null, {
                discordId: profile.id,
                username: profile.username,
                avatar: profile.avatar
            });

        }
    )
);

module.exports = passport;
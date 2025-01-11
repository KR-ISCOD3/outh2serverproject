const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { config } = require("dotenv");
const User = require("./model/user");

config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.NODE_ENV === "production"
    ? "https://outh2serverproject.onrender.com/auth/google/callback"
    : "http://localhost:4000/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      scope: ["profile", "email"], // Ensure the email scope is requested
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const { id, displayName, emails, photos } = profile;
        const email = emails?.[0]?.value;
        const avatar = photos?.[0]?.value;

        let user = await User.findOne({ googleId: id });

        if (!user) {
          user = await User.create({
            googleId: id,
            name: displayName,
            email: email || null,
            avatar,
          });
        }

        done(null, user);
      } catch (error) {
        console.error("Error saving user to the database:", error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"));
    }
    done(null, user);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error, false);
  }
});

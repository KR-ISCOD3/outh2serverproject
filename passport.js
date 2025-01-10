const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { config } = require("dotenv");
const User = require("./model/user");

config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"], // Add the "email" scope
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const { id, displayName, emails, photos } = profile;

        // Extract necessary details
        const email = emails?.[0]?.value; // Email address
        const avatar = photos?.[0]?.value; // Profile photo URL

        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: id });

        if (!user) {
          // Create a new user if not found
          user = await User.create({
            googleId: id,
            name: displayName,
            email: email || null, // Fallback to null if email is not provided
            avatar,
          });
        }

        // Pass the user object to Passport
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

passport.deserializeUser(async(id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

if (clientID && clientSecret && callbackURL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const rawEmail = profile.emails?.[0]?.value;

          if (!rawEmail) {
            return done(new Error("Google account has no email."), null);
          }

          const email = rawEmail.toLowerCase().trim();

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName || email.split("@")[0],
              email,
              profileImage: profile.photos?.[0]?.value || "",
              role: "client",
              isVerified: true,
              emailVerified: true,
            });
          } else {
            let updated = false;

            if (!user.googleId) {
              user.googleId = profile.id;
              updated = true;
            }

            if (!user.profileImage && profile.photos?.[0]?.value) {
              user.profileImage = profile.photos[0].value;
              updated = true;
            }

            if (!user.isVerified || !user.emailVerified) {
              user.isVerified = true;
              user.emailVerified = true;
              updated = true;
            }

            if (updated) {
              await user.save();
            }
          }

          return done(null, user);
        } catch (error) {
          console.error("Passport Google Strategy Error:", error);
          done(error, null);
        }
      }
    )
  );
} else {
  console.warn(
    "⚠️ Google OAuth environment variables are incomplete (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL). Passport Google OAuth is disabled."
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
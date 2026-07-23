import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn("⚠ Google OAuth credentials are missing.");
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL:
          GOOGLE_CALLBACK_URL ||
          "http://localhost:5000/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase().trim();

          if (!email) {
            return done(new Error("Google account does not have an email."), null);
          }

          const profileImage = profile.photos?.[0]?.value || "";

          let user = await User.findOne({
            $or: [
              { googleId: profile.id },
              { email },
            ],
          });

          if (!user) {
            user = await User.create({
              name: profile.displayName || email.split("@")[0],
              email,
              googleId: profile.id,
              authProvider: "google",
              profileImage,
              role: "client",
              isVerified: true,
              emailVerified: true,
              verified: true,
            });

            return done(null, user);
          }

          let updated = false;

          if (!user.googleId) {
            user.googleId = profile.id;
            updated = true;
          }

          if (user.authProvider !== "google") {
            user.authProvider = "google";
            updated = true;
          }

          if (
            profileImage &&
            (!user.profileImage || user.profileImage !== profileImage)
          ) {
            user.profileImage = profileImage;
            updated = true;
          }

          if (!user.isVerified) {
            user.isVerified = true;
            updated = true;
          }

          if (!user.emailVerified) {
            user.emailVerified = true;
            updated = true;
          }

          if (!user.verified) {
            user.verified = true;
            updated = true;
          }

          if (updated) {
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          console.error("Google OAuth Error:", err);
          return done(err, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
import "dotenv/config";
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  registerUser,
  loginUser,
  googleLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

/* ==========================================================
   AUTHENTICATION
========================================================== */

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Google Login
router.post("/google", googleLogin);

// Verify Email
router.get("/verify-email/:token", verifyEmail);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

/* ==========================================================
   GOOGLE OAUTH (PASSPORT)
========================================================== */

const getFrontendUrl = (req) => {
  const url = process.env.FRONTEND_URL || process.env.CLIENT_URL || (req ? `${req.protocol}://${req.get("host")}` : "http://localhost:5173");
  return url.replace(/\/+$/, "");
};

// Redirect to Google
router.get("/google/auth", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const frontendUrl = getFrontendUrl(req);
    return res.redirect(`${frontendUrl}/login?error=google_oauth_not_configured`);
  }
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

// Google Callback
router.get(
  "/google/callback",
  (req, res, next) => {
    const frontendUrl = getFrontendUrl(req);
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${frontendUrl}/login?error=google_auth_failed`,
    })(req, res, next);
  },
  (req, res) => {
    try {
      const frontendUrl = getFrontendUrl(req);
      const token = jwt.sign(
        {
          id: req.user._id,
          role: req.user.role,
        },
        process.env.JWT_SECRET || "skillsphere_secret",
        {
          expiresIn: "7d",
        }
      );

      res.redirect(
        `${frontendUrl}/auth/success?token=${encodeURIComponent(token)}`
      );
    } catch (error) {
      console.error("Google Callback Error:", error);

      const frontendUrl = getFrontendUrl(req);
      return res.redirect(`${frontendUrl}/login?error=google_auth_exception`);
    }
  }
);

export default router;
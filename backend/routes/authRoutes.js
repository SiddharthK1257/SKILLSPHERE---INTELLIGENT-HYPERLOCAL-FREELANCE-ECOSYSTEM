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

// Redirect to Google
router.get(
  "/google/auth",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user._id,
          role: req.user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.redirect(
        `${process.env.FRONTEND_URL}/auth/success?token=${token}`
      );
    } catch (error) {
      console.error("Google Callback Error:", error);

      return res.status(500).json({
        success: false,
        message: "Authentication failed.",
      });
    }
  }
);

export default router;
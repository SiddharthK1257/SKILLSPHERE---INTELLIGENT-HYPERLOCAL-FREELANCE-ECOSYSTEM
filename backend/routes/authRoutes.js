import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

/* ===========================
   Authentication Routes
=========================== */

// Email Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google Authentication
router.post("/google", googleLogin);

// Email Verification
router.get("/verify-email/:token", verifyEmail);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Health Check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default router;
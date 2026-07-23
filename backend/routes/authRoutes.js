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

/* ==========================================================
   AUTH ROUTES
========================================================== */

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login with email & password
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   POST /api/auth/google
 * @desc    Login/Register with Google
 * @access  Public
 */
router.post("/google", googleLogin);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get("/verify-email/:token", verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset user password
 * @access  Public
 */
router.post("/reset-password/:token", resetPassword);

/* ==========================================================
   HEALTH CHECK
========================================================== */

/**
 * @route   GET /api/auth/health
 * @desc    Authentication API status
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "Authentication Service",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
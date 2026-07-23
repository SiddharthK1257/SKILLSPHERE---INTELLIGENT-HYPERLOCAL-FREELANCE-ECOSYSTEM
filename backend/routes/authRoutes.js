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

/* =========================
   Authentication
========================= */

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google", googleLogin);

router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
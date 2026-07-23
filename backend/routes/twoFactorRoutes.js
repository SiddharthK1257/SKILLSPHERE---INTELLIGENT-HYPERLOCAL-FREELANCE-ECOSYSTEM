import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  setup2FA,
  verify2FA,
  disable2FA,
  verifyLogin2FA,
} from "../controllers/twoFactorController.js";

const router = express.Router();

/* ==========================================================
   SETUP 2FA
========================================================== */

router.get("/setup", protect, setup2FA);

/* ==========================================================
   ENABLE 2FA
========================================================== */

router.post("/verify", protect, verify2FA);

/* ==========================================================
   DISABLE 2FA
========================================================== */

router.delete("/disable", protect, disable2FA);

/* ==========================================================
   LOGIN 2FA VERIFY
========================================================== */

router.post("/login", verifyLogin2FA);

export default router;
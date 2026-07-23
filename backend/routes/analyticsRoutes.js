import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================
// Analytics Routes
// ======================================

// Get logged-in freelancer analytics
router.get("/", protect, getAnalytics);

export default router;
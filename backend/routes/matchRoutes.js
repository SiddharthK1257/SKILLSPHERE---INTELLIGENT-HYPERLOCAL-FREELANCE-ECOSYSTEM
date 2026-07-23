import express from "express";
import {
  getAIRecommendations,
  getTopMatches,
} from "../controllers/matchController.js";

const router = express.Router();

/*
=====================================================
AI Job Matching Routes
Base URL: /api/match
=====================================================
*/

// Get Top 5 AI Recommendations
// GET /api/match/top/:userId
router.get("/top/:userId", getTopMatches);

// Get All AI Recommendations
// GET /api/match/:userId
router.get("/:userId", getAIRecommendations);

export default router;
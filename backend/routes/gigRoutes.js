import express from "express";

import {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig,
  getMyGigs,
} from "../controllers/gigController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================
   Public Routes
========================================= */

// Get all gigs
router.get("/", getAllGigs);

// Get logged-in user's gigs
router.get("/mygigs", protect, getMyGigs);

// Get single gig by ID
router.get("/:id", getGigById);

/* =========================================
   Protected Routes
========================================= */

// Create new gig
router.post("/", protect, createGig);

// Update gig
router.put("/:id", protect, updateGig);

// Delete gig
router.delete("/:id", protect, deleteGig);

export default router;
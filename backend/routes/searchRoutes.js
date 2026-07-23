import express from "express";
import { searchGigs } from "../controllers/searchController.js";

const router = express.Router();

/*
=========================================================
ADVANCED SEARCH ROUTES
Base URL: /api/search
=========================================================
*/

// Search Gigs
router.get("/", searchGigs);

export default router;
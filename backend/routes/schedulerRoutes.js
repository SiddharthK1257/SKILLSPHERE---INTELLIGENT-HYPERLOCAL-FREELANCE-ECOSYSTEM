import express from "express";

import {
  getSlots,
  createSlot,
  bookSlot,
  deleteSlot,
} from "../controllers/schedulerController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSlots);

router.post("/", protect, createSlot);

router.put("/:id", protect, bookSlot);

router.delete("/:id", protect, deleteSlot);

export default router;
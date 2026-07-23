import express from "express";
import { generateProfileSummary } from "../controllers/aiController.js";

const router = express.Router();

router.get("/summary/:id", generateProfileSummary);

export default router;
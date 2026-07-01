import express from "express";
import { generateSummary } from "../controllers/summarizeController.js";
import { protect } from "../middleware/auth.js";

const router =express.Router();

router.post("/",protect, generateSummary);

export default router;
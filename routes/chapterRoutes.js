import express from "express";
import {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} from "../controllers/chapterController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
const router = express.Router();

// Public
router.get("/", getChapters);
router.get("/:id", getChapterById);

// Protected
router.post("/", requireAuth, adminOnly, createChapter);
router.put("/:id", requireAuth, adminOnly, updateChapter);
router.delete("/:id", requireAuth, adminOnly, deleteChapter);

export default router;

import express from "express";
import {
  addChapter,
  getChaptersBySubject,
  updateChapter,
  deleteChapter,
  findChapter,
  getChapterById,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/chapterController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";
const router = express.Router();

// Public
// find resolver: /api/chapters/find?board=...&grade=...&subject=...&chapter=...
router.get("/chapters/find", findChapter);

// get chapter by id
router.get("/chapters/:id", getChapterById);

// Get chapters for a subject (mounted as /api/subjects/:subjectId/chapters)
router.get("/subjects/:subjectId/chapters", getChaptersBySubject);

// Legacy root (keeps backward compatibility)
router.get("/", getChaptersBySubject);

// Protected
// Create a chapter under a subject
router.post("/subjects/:subjectId/chapters", requireAuth, adminProtect, addChapter);
router.put("/:id", requireAuth, adminProtect, updateChapter);
router.delete("/:id", requireAuth, adminProtect, deleteChapter);

// Admin: manage questions (MCQs)
router.post("/:id/questions", requireAuth, adminProtect, addQuestion);
router.put("/:id/questions/:qId", requireAuth, adminProtect, updateQuestion);
router.delete("/:id/questions/:qId", requireAuth, adminProtect, deleteQuestion);

export default router;

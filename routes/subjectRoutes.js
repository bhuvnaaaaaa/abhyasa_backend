import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getSubjects);
router.get("/:id", getSubjectById);

// Protected
router.post("/", requireAuth, createSubject);
router.put("/:id", requireAuth, updateSubject);
router.delete("/:id", requireAuth, deleteSubject);

export default router;

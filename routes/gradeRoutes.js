import express from "express";
import {
  createGrade,
  getGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
} from "../controllers/gradeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getGrades); 
router.get("/:id", getGradeById);

// Protected
router.post("/", requireAuth, createGrade);
router.put("/:id", requireAuth, updateGrade);
router.delete("/:id", requireAuth, deleteGrade);

export default router;

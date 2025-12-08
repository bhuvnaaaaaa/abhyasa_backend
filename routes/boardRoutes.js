import express from "express";
import {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getBoards);

// Protected
router.post("/", requireAuth, createBoard);
router.put("/:id", requireAuth, updateBoard);
router.delete("/:id", requireAuth, deleteBoard);

export default router;

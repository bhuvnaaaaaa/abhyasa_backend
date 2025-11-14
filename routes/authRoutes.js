import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protected", requireAuth, (req, res) => {
  res.json({ message: "Authenticated!", user: req.user });
});

export default router;

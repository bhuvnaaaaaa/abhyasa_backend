import express from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser, updatePaymentStatus } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.put("/payment", requireAuth, updatePaymentStatus);

router.get("/protected", requireAuth, (req, res) => {
  res.json({ message: "Authenticated!", user: req.user });
});

export default router;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

// (Removed Google OAuth/passport setup)

// Allow frontend origins for development. Include common dev ports and
// accept any `localhost` origin to avoid preflight mismatches when using
// different dev ports (5173/5174/5175/etc.). In production set `CLIENT_URL`.
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // allow any localhost origin during development (flexible for different ports)
      try {
        const url = new URL(origin);
        if (url.hostname === 'localhost') return callback(null, true);
      } catch (err) {
        // fallthrough to deny
      }
      return callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/boards", boardRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api", chapterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
// also accept legacy/admin path without /api prefix
app.use("/admin", adminRoutes);



app.get("/", (req, res) => {
  res.send("Abhyasa API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

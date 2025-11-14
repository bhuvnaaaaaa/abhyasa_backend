import mongoose from "mongoose";
import dotenv from "dotenv";

import Board from "../models/boardModel.js";
import Grade from "../models/gradeModel.js";
import Subject from "../models/subjectModel.js";
import Chapter from "../models/chapterModel.js";

dotenv.config();

// -----------------------------------------
// CONNECT DB
// -----------------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully (Seed)");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

// -----------------------------------------
// CONFIGURABLE DATA
// -----------------------------------------
const boards = [
  {
    name: "State Board",
    grades: ["8", "9", "10"],
    subjects: [
      { name: "Mathematics", chapterCount: 12 },
      { name: "Science", chapterCount: 12 },
      { name: "Social Science", chapterCount: 12 },
      { name: "English", chapterCount: 12 },
    ],
  },
];

// -----------------------------------------
// SEED FUNCTION
// -----------------------------------------
const seedAll = async () => {
  try {
    await connectDB();

    console.log("Clearing old data...");
    await Board.deleteMany({});
    await Grade.deleteMany({});
    await Subject.deleteMany({});
    await Chapter.deleteMany({});
    console.log("Old data cleared.\n");

    for (const boardData of boards) {
      console.log(`📌 Creating Board: ${boardData.name}`);

      const board = await Board.create({ name: boardData.name });

      for (const gradeName of boardData.grades) {
        console.log(`   ↳ Creating Grade ${gradeName}`);

        const grade = await Grade.create({
          grade: gradeName,
          board: board._id,
        });

        for (const subjectInfo of boardData.subjects) {
          console.log(`      ↳ Subject: ${subjectInfo.name}`);

          const subject = await Subject.create({
            name: subjectInfo.name,
            board: board._id,
            grade: grade._id,
          });

          // ------------------------------
          // AUTO-CREATE CHAPTERS (FIXED)
          // ------------------------------
          const chapterPromises = [];

          for (let i = 1; i <= subjectInfo.chapterCount; i++) {
            chapterPromises.push(
              Chapter.create({
                title: `Chapter ${i}`,          // ✔ FIXED — using required field
                number: i,
                description: "",                // optional but safe
                content: "",                    // optional placeholder
                board: board._id,
                grade: grade._id,
                subject: subject._id,
              })
            );
          }

          await Promise.all(chapterPromises);
          console.log(
            `         ✔ Created ${subjectInfo.chapterCount} chapters for ${subjectInfo.name}`
          );
        }
      }
    }

    console.log("\n🎉 SEEDING COMPLETE — Your database is ready!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedAll();

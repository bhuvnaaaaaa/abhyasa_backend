import Chapter from "../models/chapterModel.js";
import Subject from "../models/subjectModel.js";

// @desc Get all chapters for a specific subject
// @route GET /api/subjects/:subjectId/chapters
export const getChaptersBySubject = async (req, res) => {
  try {
    const chapters = await Chapter.find({ subject: req.params.subjectId });
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add a chapter under a subject
// @route POST /api/subjects/:subjectId/chapters
export const addChapter = async (req, res) => {
  try {
    const { title, description, marksType } = req.body;
    const subjectId = req.params.subjectId;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const chapter = new Chapter({ title, description, marksType, subject: subjectId });
    await chapter.save();
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a chapter
// @route PUT /api/chapters/:id
export const updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a chapter
// @route DELETE /api/chapters/:id
export const deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

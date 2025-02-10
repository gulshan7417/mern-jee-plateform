const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Test = require("../models/Test");
const { isAdmin } = require("../middleware/auth");

// ➤ Add a Question (Admins only)
router.post("/add-question", isAdmin, async (req, res) => {
  try {
    const { text, options, difficulty, category } = req.body;
    const newQuestion = new Question({ text, options, difficulty, category, createdBy: req.user._id });
    await newQuestion.save();
    res.json({ message: "Question added successfully!", question: newQuestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Create a Test (Admins only)
router.post("/create-test", isAdmin, async (req, res) => {
  try {
    const { title, description, questionIds } = req.body;
    const newTest = new Test({ title, description, questions: questionIds, createdBy: req.user._id });
    await newTest.save();
    res.json({ message: "Test created successfully!", test: newTest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get All Questions (Admins only)
router.get("/questions", isAdmin, async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get All Tests (Admins only)
router.get("/tests", isAdmin, async (req, res) => {
  try {
    const tests = await Test.find().populate("questions");
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

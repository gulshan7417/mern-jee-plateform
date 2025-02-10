const Test = require("../models/Test");

// Controller function to create a new test
exports.createTest = async (req, res) => {
  const { title, questions } = req.body;

  // Validate test title
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Test title is required." });
  }

  // Validate questions array
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "At least one question is required." });
  }

  // (Optional) Additional validations for each question can be added here

  try {
    // Create a new test object using the Test model and save to MongoDB
    const newTest = new Test({ title: title.trim(), questions });
    const savedTest = await newTest.save();

    return res.status(201).json({
      message: "Test created successfully!",
      test: savedTest,
    });
  } catch (error) {
    console.error("Error creating test:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Controller function to get all tests
exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    if (!tests || tests.length === 0) {
      return res.status(404).json({ error: "No tests found." });
    }
    return res.status(200).json({
      count: tests.length,
      tests,
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

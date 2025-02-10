// controllers/submissionController.js
const Submission = require("../models/Submission");
const Test = require("../models/Test");

exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;

    if (!testId) {
      return res.status(400).json({ error: "Test ID is required." });
    }

    // (Optional) Verify that the test exists.
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    // Create a new submission document.
    const submission = new Submission({
      test: testId,
      answers,
    });
    const savedSubmission = await submission.save();

    return res.status(201).json({
      message: "Test submitted successfully.",
      submission: savedSubmission,
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
exports.getUserSubmissions = async (req, res) => {
    try {
      const userId = req.params.userId;
      // Fetch submissions for the given user and populate the test field.
      const submissions = await Submission.find({ user: userId }).populate("test");
      return res.status(200).json({ submissions });
    } catch (error) {
      console.error("Error fetching user submissions:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  };
  
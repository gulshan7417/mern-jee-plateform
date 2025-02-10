// models/Submission.js
const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure this matches your user model name
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  answers: {
    type: Map,
    of: String,
    default: {},
  },
  score: {
    type: String,
    default: "N/A", // Or compute a score if needed
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", SubmissionSchema);

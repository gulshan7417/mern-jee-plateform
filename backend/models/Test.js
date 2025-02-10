// models/Test.js

const mongoose = require("mongoose");

// Define a schema for questions
const QuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: { type: String, required: true },
    options: { type: [String] },       // For MCQ type questions
    correctAnswer: { type: String },     // For MCQ type questions
    modelAnswer: { type: String }        // For subjective type questions
  },
  { _id: false } // Prevents Mongoose from creating an _id for each subdocument
);

// Define the main Test schema
const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  questions: {
    type: [QuestionSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Test", TestSchema);

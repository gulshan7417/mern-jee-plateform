import React, { useState } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar";

// Default question structures for MCQ and Subjective types (both include an "image" field)
const defaultMCQ = {
  text: "",
  type: "mcq", // "mcq" or "subjective"
  options: ["", "", "", ""],
  correctAnswer: "",
  image: null,
};

const defaultSubjective = {
  text: "",
  type: "subjective",
  modelAnswer: "",
  image: null,
};

const CreateTest = () => {
  // State definitions
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(defaultMCQ);
  const [editingIndex, setEditingIndex] = useState(null); // null when not editing
  const [feedback, setFeedback] = useState(""); // temporary feedback message
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Handler for image upload (converts selected file to a Base64 string)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentQuestion({ ...currentQuestion, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove the uploaded image
  const removeImage = () => {
    setCurrentQuestion({ ...currentQuestion, image: null });
  };

  // For MCQ questions: add an extra option field
  const addOptionField = () => {
    if (currentQuestion.type === "mcq") {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      });
    }
  };

  // For MCQ questions: remove a specific option (ensuring at least 2 remain)
  const removeOptionField = (index) => {
    if (currentQuestion.type === "mcq") {
      if (currentQuestion.options.length > 2) {
        const newOptions = currentQuestion.options.filter((_, i) => i !== index);
        let newCorrect = currentQuestion.correctAnswer;
        if (currentQuestion.options[index] === currentQuestion.correctAnswer) {
          newCorrect = "";
        }
        setCurrentQuestion({
          ...currentQuestion,
          options: newOptions,
          correctAnswer: newCorrect,
        });
      } else {
        setFeedback("At least 2 options are required for an MCQ.");
        setTimeout(() => setFeedback(""), 3000);
      }
    }
  };

  // Handle switching between MCQ and Subjective question types
  const handleTypeChange = (e) => {
    const type = e.target.value;
    if (type === "mcq") {
      setCurrentQuestion(defaultMCQ);
    } else {
      setCurrentQuestion(defaultSubjective);
    }
  };

  // Add a new question or update an existing one
  const addOrUpdateQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setFeedback("Please enter the question text.");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }
    if (currentQuestion.type === "mcq") {
      const validOptions = currentQuestion.options.filter(
        (opt) => opt.trim() !== ""
      );
      if (validOptions.length < 2) {
        setFeedback("Please enter at least two options.");
        setTimeout(() => setFeedback(""), 3000);
        return;
      }
      if (!currentQuestion.correctAnswer.trim()) {
        setFeedback("Please specify the correct answer for the MCQ.");
        setTimeout(() => setFeedback(""), 3000);
        return;
      }
    }
    // For subjective questions, modelAnswer is optional

    if (editingIndex !== null) {
      const newQuestions = [...questions];
      newQuestions[editingIndex] = currentQuestion;
      setQuestions(newQuestions);
      setFeedback("Question updated!");
      setEditingIndex(null);
    } else {
      setQuestions([...questions, currentQuestion]);
      setFeedback("Question added!");
    }
    setCurrentQuestion(
      currentQuestion.type === "mcq" ? defaultMCQ : defaultSubjective
    );
    setTimeout(() => setFeedback(""), 3000);
  };

  // Load a question into the editor for editing
  const editQuestion = (index) => {
    setCurrentQuestion(questions[index]);
    setEditingIndex(index);
  };

  // Delete a question from the list
  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setFeedback("Question removed!");
    setTimeout(() => setFeedback(""), 3000);
  };

  // Submit the test data to the backend
  const handleSubmit = async () => {
    if (!testTitle.trim()) {
      setFeedback("Please enter a test title.");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }
    if (questions.length === 0) {
      setFeedback("Please add at least one question.");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5001/api/tests/create", {
        title: testTitle,
        questions,
      });
      setFeedback("Test Created Successfully!");
      setTestTitle("");
      setQuestions([]);
    } catch (error) {
      console.error("Error creating test:", error);
      setFeedback("Error creating test. Please try again.");
    }
    setSubmitting(false);
    setTimeout(() => setFeedback(""), 3000);
  };
  

  return (
    <div className="flex min-h-screen bg-blue-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Create a New Test</h1>
        
        {/* Test Title Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter Test Title"
            className="w-full p-2 text-black mb-4 rounded"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
          />
        </div>

        {/* Question Input Section */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            {editingIndex !== null ? "Edit Question" : "Add a New Question"}
          </h2>

          {/* Question Type Selection */}
          <div className="flex space-x-4 mb-4">
            <label>
              <input
                type="radio"
                name="questionType"
                value="mcq"
                checked={currentQuestion.type === "mcq"}
                onChange={handleTypeChange}
                className="mr-1"
              />
              MCQ
            </label>
            <label>
              <input
                type="radio"
                name="questionType"
                value="subjective"
                checked={currentQuestion.type === "subjective"}
                onChange={handleTypeChange}
                className="mr-1"
              />
              Subjective
            </label>
          </div>

          {/* Question Text */}
          <input
            type="text"
            placeholder="Enter Question"
            className="w-full p-2 text-black mb-2 rounded"
            value={currentQuestion.text}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, text: e.target.value })
            }
          />

          {/* Image Upload Field */}
          <div className="mb-4">
            <label className="block mb-1">
              Include Diagram/Image (optional):
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {currentQuestion.image && (
              <div className="mt-2">
                <img
                  src={currentQuestion.image}
                  alt="Question Diagram"
                  className="max-h-48"
                />
                <button
                  className="ml-2 bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition"
                  onClick={removeImage}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Conditional Rendering Based on Question Type */}
          {currentQuestion.type === "mcq" ? (
            <>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="w-full p-2 text-black rounded"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                    }}
                  />
                  <button
                    className="ml-2 bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => removeOptionField(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition mt-2"
                onClick={addOptionField}
              >
                Add Option
              </button>
              <input
                type="text"
                placeholder="Correct Answer"
                className="w-full p-2 text-black mt-4 mb-2 rounded"
                value={currentQuestion.correctAnswer}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    correctAnswer: e.target.value,
                  })
                }
              />
            </>
          ) : (
            <textarea
              placeholder="Enter Model Answer (optional)"
              className="w-full p-2 text-black mt-4 mb-2 rounded"
              value={currentQuestion.modelAnswer || ""}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  modelAnswer: e.target.value,
                })
              }
            />
          )}

          <div className="flex space-x-4">
            <button
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={addOrUpdateQuestion}
            >
              {editingIndex !== null ? "Update Question" : "Add Question"}
            </button>
            {editingIndex !== null && (
              <button
                className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 transition"
                onClick={() => {
                  setCurrentQuestion(
                    currentQuestion.type === "mcq" ? defaultMCQ : defaultSubjective
                  );
                  setEditingIndex(null);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
          {feedback && <p className="mt-2 text-sm text-yellow-300">{feedback}</p>}
        </div>

        {/* Questions List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Questions Added:</h2>
          {questions.length === 0 ? (
            <p>No questions added yet.</p>
          ) : (
            questions.map((q, idx) => (
              <div
                key={idx}
                className="bg-gray-700 p-4 mb-2 rounded flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">
                    {idx + 1}. {q.text}
                  </p>
                  {q.image && (
                    <img
                      src={q.image}
                      alt="Question Diagram"
                      className="max-h-32 my-2"
                    />
                  )}
                  {q.type === "mcq" ? (
                    <>
                      <ul className="ml-4">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                      <p className="text-green-400">
                        Correct: {q.correctAnswer}
                      </p>
                    </>
                  ) : (
                    <p className="text-green-400">
                      Model Answer: {q.modelAnswer ? q.modelAnswer : "N/A"}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() => editQuestion(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => deleteQuestion(idx)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            className="bg-indigo-600 px-6 py-3 rounded hover:bg-indigo-700 transition"
            onClick={() => setShowPreview(true)}
          >
            Preview Test
          </button>
          <button
            className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 transition"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black rounded-lg p-6 max-w-3xl w-full overflow-y-auto max-h-screen">
              <h2 className="text-2xl font-bold mb-4">Test Preview</h2>
              <p className="mb-2">
                <strong>Title:</strong> {testTitle}
              </p>
              <p className="mb-4">
                <strong>Created by:</strong> Admin
              </p>
              {questions.map((q, idx) => (
                <div key={idx} className="mb-6 border-b pb-4">
                  <p className="font-semibold">
                    {idx + 1}. {q.text}
                  </p>
                  {q.image && (
                    <img
                      src={q.image}
                      alt="Question Diagram"
                      className="max-h-48 my-2"
                    />
                  )}
                  {q.type === "mcq" ? (
                    <div>
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center mb-1">
                          <input type="radio" disabled className="mr-2" />
                          {opt.trim() === q.correctAnswer.trim() ? (
                            <span className="font-bold text-green-600">
                              {opt} (Correct)
                            </span>
                          ) : (
                            <span>{opt}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        disabled
                        placeholder="Your answer..."
                        className="w-full p-2 border rounded"
                      />
                      {q.modelAnswer && (
                        <p className="mt-2 text-green-600">
                          Model Answer: {q.modelAnswer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
                  onClick={() => setShowPreview(false)}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateTest;

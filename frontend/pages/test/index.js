import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Sidebar from "@/components/sidebar";

const TestPage = () => {
  const router = useRouter();

  // Helper function: returns an array of visible page numbers.
  const getPageNumbers = (currentPage, totalPages, maxVisible = 5) => {
    const pages = [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
      if (end > totalPages) {
        end = totalPages;
        start = end - maxVisible + 1;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  // ==================== STATE VARIABLES ====================
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const totalTime = 300;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [currentTestPage, setCurrentTestPage] = useState(1);
  const testsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  // ==================== FETCH DATA FROM BACKEND ====================
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/tests")
      .then((response) => {
        // Expecting the backend to send { tests: [ ... ] }
        setAvailableTests(response.data.tests);
      })
      .catch((error) => {
        console.error("Error fetching tests:", error);
      });
  }, []);

  // Reset tests pagination when search term changes
  useEffect(() => {
    setCurrentTestPage(1);
  }, [searchTerm]);

  // Global timer for test-taking view
  useEffect(() => {
    if (!selectedTest || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, selectedTest]);

  // ==================== HANDLERS ====================
  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    // Unmark review when an answer is provided.
    setMarkedForReview((prev) => ({ ...prev, [questionId]: false }));
  };

  const toggleReview = (questionId) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted answers:", answers);
    alert("Test submitted!");
  };

  // Return status color based on answer/review state.
  const getQuestionStatusColor = (questionId) => {
    if (markedForReview[questionId]) return "bg-yellow-400";
    if (answers[questionId]) return "bg-green-400";
    return "bg-red-400";
  };

  // ==================== CALCULATIONS ====================
  // Filter tests based on search term.
  const filteredTests = availableTests.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalTestPages = Math.ceil(filteredTests.length / testsPerPage);
  const startTestIndex = (currentTestPage - 1) * testsPerPage;
  const testsToDisplay = filteredTests.slice(
    startTestIndex,
    startTestIndex + testsPerPage
  );

  // For test-taking view, use the questions from the selected test.
  const totalQuestions = selectedTest ? selectedTest.questions.length : 0;
  const startIndex = selectedTest ? (currentPage - 1) * questionsPerPage : 0;
  const currentQuestions = selectedTest
    ? selectedTest.questions.slice(startIndex, startIndex + questionsPerPage)
    : [];

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter((v) => v).length;
  const remainingCount = totalQuestions - answeredCount;

  // ==================== RENDERING ====================
  // If no test is selected, show the available tests list.
  if (!selectedTest) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Back
            </button>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Available Tests</h1>
            {/* Search Input */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search tests..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid gap-6">
              {testsToDisplay.map((test) => (
                <div
                  key={test._id}
                  className="relative border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-2xl transition transform hover:scale-105 duration-300"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">{test.title}</h2>
                    <span className="text-sm text-gray-500">
                      {test.subject || "N/A"}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-3">
                    {test.description || "No description available."}
                  </p>
                  {/* Start Test and Preview Buttons */}
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => {
                        setSelectedTest(test);
                        setTimeLeft(totalTime);
                        setCurrentPage(1);
                        setAnswers({});
                        setMarkedForReview({});
                      }}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Start Test
                    </button>
                    <button
                      onClick={() => alert(`Preview of ${test.title}`)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls for Test List */}
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentTestPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentTestPage === 1}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex space-x-2 overflow-x-auto">
                {getPageNumbers(currentTestPage, totalTestPages).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentTestPage(pageNum)}
                    className={`px-3 py-2 rounded-lg transition ${
                      currentTestPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentTestPage((prev) => Math.min(prev + 1, totalTestPages))}
                disabled={currentTestPage === totalTestPages || totalTestPages === 0}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==================== TEST-TAKING VIEW ====================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          {/* Header with Test Title, Timer, and Back Button */}
          <div className="flex justify-between items-center border-b pb-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-800">{selectedTest.title}</h1>
            <div className="flex items-center space-x-6">
              <p className="text-lg text-gray-600">
                Time Left:{" "}
                <span className="font-semibold text-blue-700">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </p>
              <button
                onClick={() => setSelectedTest(null)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Back
              </button>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-md">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-blue-800">{totalQuestions}</p>
                <p className="text-gray-700">Total</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-green-800">{answeredCount}</p>
                <p className="text-gray-700">Answered</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-red-800">{remainingCount}</p>
                <p className="text-gray-700">Remaining</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-yellow-800">{markedCount}</p>
                <p className="text-gray-700">Marked</p>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="flex flex-wrap gap-3 mb-8">
            {selectedTest.questions.map((question, idx) => {
              // Generate a unique identifier for each question.
              const uniqueId = question.id || `question-${idx}`;
              return (
                <div
                  key={uniqueId}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm text-white cursor-pointer shadow-md ${getQuestionStatusColor(uniqueId)} hover:scale-110 transition-transform duration-300`}
                  onClick={() =>
                    setCurrentPage(Math.floor(idx / questionsPerPage) + 1)
                  }
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>

          {/* Questions and Answer Form */}
          <form onSubmit={handleSubmit}>
            {currentQuestions.map((question, index) => {
              // Generate a unique identifier for each question in the current page.
              const uniqueId = question.id || `question-${startIndex + index}`;
              return (
                <div
                  key={uniqueId}
                  className="mb-8 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-semibold text-gray-800">
                      {startIndex + index + 1}. {question.text}
                    </p>
                  </div>
                  {question.type === "subjective" ? (
                    <textarea
                      className="w-full p-2 border rounded"
                      placeholder="Type your answer here..."
                      value={answers[uniqueId] || ""}
                      onChange={(e) => handleAnswerChange(uniqueId, e.target.value)}
                    />
                  ) : (
                    <div className="space-y-3">
                      {question.options.map((option, idx) => (
                        <label key={idx} className="flex items-center text-gray-700">
                          <input
                            type="radio"
                            name={uniqueId}
                            value={option}
                            checked={answers[uniqueId] === option}
                            onChange={() => handleAnswerChange(uniqueId, option)}
                            className="form-radio text-blue-600 mr-3"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => toggleReview(uniqueId)}
                      className={`px-4 py-2 rounded-lg text-sm transition ${
                        markedForReview[uniqueId]
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                      }`}
                    >
                      {markedForReview[uniqueId] ? "Unmark Review" : "Mark for Review"}
                    </button>
                  </div>
                </div>
              );
            })}
            {/* Pagination for Questions */}
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex space-x-2 overflow-x-auto">
                {getPageNumbers(currentPage, Math.ceil(totalQuestions / questionsPerPage)).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg transition ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(totalQuestions / questionsPerPage)))}
                disabled={currentPage === Math.ceil(totalQuestions / questionsPerPage)}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="mt-8 w-full px-8 py-4 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 transition"
            >
              Submit Test
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TestPage;

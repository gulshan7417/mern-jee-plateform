import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/sidebar";
import testsData from "@/data/testsData";
import questionsData from "@/data/questionsData";
import axios from "axios";

const DynamicTestPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // For demonstration, we assume a logged-in student.
  const student = { id: "12345", name: "John Doe" };

  // Find the selected test by id.
  const selectedTest = testsData.find((test) => test.id === id);

  // Show loading/fallback if test is not found.
  if (!selectedTest) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p>Test not found or still loading...</p>
      </div>
    );
  }

  // Retrieve questions based on the test's subject.
  const subjectQuestions = questionsData[selectedTest.subject] || [];
  const totalQuestions = subjectQuestions.length;

  // Pagination settings.
  const questionsPerPage = 10;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // State for storing student answers and review markers.
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});

  // Global test timer.
  const totalTime = 300; // seconds (5 minutes)
  const [timeLeft, setTimeLeft] = useState(totalTime);

  // For tracking time spent on each question.
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [activeQuestionStartTime, setActiveQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState({});

  // A dummy tick to force re-renders every second.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const tickInterval = setInterval(() => setTick((prev) => prev + 1), 1000);
    return () => clearInterval(tickInterval);
  }, []);

  // Global countdown timer.
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Determine the questions for the current page.
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = subjectQuestions.slice(startIndex, startIndex + questionsPerPage);

  // Summary statistics.
  const attemptedCount = subjectQuestions.filter((q) => answers[q.id]).length;
  const unattemptedCount = totalQuestions - attemptedCount;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;

  // Format time (minutes:seconds).
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  // Handle answer changes.
  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    // If a question is answered, clear any review mark.
    setMarkedForReview((prev) => ({ ...prev, [questionId]: false }));
  };

  // Toggle marking a question for review.
  const toggleReview = (questionId) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Track the time spent when a question is focused.
  const handleQuestionFocus = (questionId) => {
    const now = Date.now();
    if (activeQuestionId) {
      const timeSpent = (now - activeQuestionStartTime) / 1000; // in seconds
      setQuestionTimes((prev) => ({
        ...prev,
        [activeQuestionId]: (prev[activeQuestionId] || 0) + timeSpent,
      }));
    }
    setActiveQuestionId(questionId);
    setActiveQuestionStartTime(now);
  };

  // When leaving the page or switching questions, record time spent on the active question.
  useEffect(() => {
    return () => {
      if (activeQuestionId) {
        const now = Date.now();
        const timeSpent = (now - activeQuestionStartTime) / 1000;
        setQuestionTimes((prev) => ({
          ...prev,
          [activeQuestionId]: (prev[activeQuestionId] || 0) + timeSpent,
        }));
      }
    };
  }, [activeQuestionId, activeQuestionStartTime]);

  // Pagination navigation.
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Submit test: send student answers, overall time, and per-question time data.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      studentId: student.id,
      studentName: student.name,
      testId: selectedTest.id,
      subject: selectedTest.subject,
      answers,
      timeTaken: totalTime - timeLeft,
      questionTimes,
    };
    try {
      const res = await axios.post("http://localhost:5001/api/tests/submit", payload, {
        withCredentials: true,
      });
      console.log("Test submitted:", res.data);
      alert("Test submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("There was an error submitting your test. Please try again.");
    }
  };

  // Determine the color for each question's navigator indicator.
  const getQuestionStatusColor = (questionId) => {
    if (markedForReview[questionId]) return "bg-yellow-400";
    if (answers[questionId]) return "bg-green-400";
    return "bg-red-400";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* Header with Test and Student Info */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {selectedTest.title}
              </h1>
              <p className="text-gray-600 mt-1">Subject: {selectedTest.subject}</p>
              <p className="text-gray-600 mt-1">Student: {student.name}</p>
              <p className="text-gray-600 mt-1">
                Time Left:{" "}
                <span className="font-semibold">{formatTime(timeLeft)}</span> /{" "}
                {formatTime(totalTime)}
              </p>
            </div>
            <button
              onClick={() => router.push("/test")}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Back to Test List
            </button>
          </div>

          {/* Summary Stats Panel */}
          <div className="flex justify-between items-center mb-6 p-4 bg-gray-200 rounded-lg">
            <div className="flex space-x-4">
              <div className="p-4 bg-green-100 rounded-lg shadow">
                <p className="text-lg font-semibold text-green-800">
                  {attemptedCount}
                </p>
                <p className="text-gray-600">Attempted</p>
              </div>
              <div className="p-4 bg-red-100 rounded-lg shadow">
                <p className="text-lg font-semibold text-red-800">
                  {unattemptedCount}
                </p>
                <p className="text-gray-600">Unattempted</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg shadow">
                <p className="text-lg font-semibold text-blue-800">
                  {totalQuestions}
                </p>
                <p className="text-gray-600">Total</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg shadow">
                <p className="text-lg font-semibold text-yellow-800">
                  {markedCount}
                </p>
                <p className="text-gray-600">Marked</p>
              </div>
            </div>
            <p className="text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {/* Question Navigator: Clickable, color-coded indicators */}
          <div className="flex flex-wrap gap-2 mb-6">
            {subjectQuestions.map((question, idx) => (
              <div
                key={question.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm text-white cursor-pointer ${getQuestionStatusColor(
                  question.id
                )}`}
                onClick={() => {
                  const page = Math.floor(idx / questionsPerPage) + 1;
                  setCurrentPage(page);
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Questions List */}
          <form onSubmit={handleSubmit}>
            {currentQuestions.map((question, index) => (
              <div
                key={question.id}
                className="mb-6 border p-4 rounded-lg"
                onFocus={() => handleQuestionFocus(question.id)}
                tabIndex={0}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-gray-800">
                    {startIndex + index + 1}. {question.question}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleQuestionFocus(question.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                  >
                    Focus
                  </button>
                </div>
                <div className="flex flex-col space-y-2">
                  {question.options.map((option, idx) => (
                    <label key={idx} className="flex items-center">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                        className="form-radio text-blue-600 mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => toggleReview(question.id)}
                    className={`px-3 py-1 rounded-md text-sm transition ${
                      markedForReview[question.id]
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {markedForReview[question.id] ? "Unmark Review" : "Mark for Review"}
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination Navigation */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 w-full px-6 py-3 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition"
            >
              Submit Test
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DynamicTestPage;

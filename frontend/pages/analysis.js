import React from "react";
import Sidebar from "@/components/sidebar";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import html2canvas from "html2canvas";

// Register Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

const TestAnalysisDashboard = () => {
  // Example data for subject-wise marks.
  const subjectWiseMarks = [
    { subject: "Mathematics", marks: 85, total: 100 },
    { subject: "Physics", marks: 75, total: 100 },
    { subject: "Chemistry", marks: 65, total: 100 },
    { subject: "Biology", marks: 80, total: 100 },
  ];

  // Calculate overall performance.
  const totalObtained = subjectWiseMarks.reduce(
    (acc, cur) => acc + cur.marks,
    0
  );
  const totalPossible = subjectWiseMarks.reduce(
    (acc, cur) => acc + cur.total,
    0
  );
  const overallPercentage = Math.round((totalObtained / totalPossible) * 100);

  // Find highest and lowest scoring subjects.
  const highestSubject = subjectWiseMarks.reduce((prev, curr) =>
    prev.marks > curr.marks ? prev : curr
  );
  const lowestSubject = subjectWiseMarks.reduce((prev, curr) =>
    prev.marks < curr.marks ? prev : curr
  );

  // Data for Overall Performance Pie Chart.
  const pieData = {
    labels: ["Obtained", "Remaining"],
    datasets: [
      {
        data: [overallPercentage, 100 - overallPercentage],
        backgroundColor: ["#34d399", "#f87171"],
        hoverBackgroundColor: ["#10b981", "#ef4444"],
      },
    ],
  };

  // Data for Subject Wise Marks Horizontal Bar Chart.
  const horizontalBarData = {
    labels: subjectWiseMarks.map((item) => item.subject),
    datasets: [
      {
        label: "Marks Obtained",
        data: subjectWiseMarks.map((item) => item.marks),
        backgroundColor: "#60a5fa",
      },
      {
        label: "Total Marks",
        data: subjectWiseMarks.map((item) => item.total),
        backgroundColor: "#a5b4fc",
      },
    ],
  };

  const horizontalBarOptions = {
    indexAxis: "y",
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "#1e3a8a",
      },
    },
  };

  // Data for Time Per Question Line Chart.
  const timePerQuestion = [
    { question: "Q1", time: 90 },
    { question: "Q2", time: 120 },
    { question: "Q3", time: 105 },
    { question: "Q4", time: 110 },
  ];

  const lineData = {
    labels: timePerQuestion.map((item) => item.question),
    datasets: [
      {
        label: "Time (seconds)",
        data: timePerQuestion.map((item) => item.time),
        fill: false,
        borderColor: "#fbbf24",
        tension: 0.1,
        pointBackgroundColor: "#f59e0b",
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...timePerQuestion.map((item) => item.time)) + 30,
      },
    },
  };

  // Function to download report
  const downloadReport = () => {
    const element = document.getElementById("dashboard");
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "Test_Analysis_Report.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <div
          className="bg-white shadow-lg rounded-xl p-8"
          id="dashboard"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Test Analysis Dashboard
          </h1>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-blue-100 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700">Overall Score</h3>
              <p className="text-3xl font-bold text-blue-600">{overallPercentage}%</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700">Best Subject</h3>
              <p className="text-xl font-bold text-green-600">{highestSubject.subject} ({highestSubject.marks} Marks)</p>
            </div>
            <div className="p-4 bg-red-100 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700">Weakest Subject</h3>
              <p className="text-xl font-bold text-red-600">{lowestSubject.subject} ({lowestSubject.marks} Marks)</p>
            </div>
          </div>

          {/* Use a responsive grid to display charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Performance Pie Chart */}
            <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                Overall Performance
              </h2>
              <div className="w-64 h-64 mx-auto">
                <Pie data={pieData} />
              </div>
              <p className="mt-4 text-center text-gray-600">
                Overall Score: {overallPercentage}%
              </p>
            </div>

            {/* Subject Wise Marks Horizontal Bar Chart */}
            <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                Subject Wise Marks
              </h2>
              <div className="w-full h-80">
                <Bar data={horizontalBarData} options={horizontalBarOptions} />
              </div>
            </div>
          </div>

          {/* Full-Width Section for Time Per Question */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
              Time Per Question
            </h2>
            <div className="w-full h-80">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          {/* Download Report Button */}
          <div className="text-center mt-8">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={downloadReport}
            >
              📥 Download Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestAnalysisDashboard;

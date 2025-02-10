import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [data, setData] = useState({ testHistory: [], bookmarks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch test history and bookmarks from the backend API
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/history', { withCredentials: true })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-4">Loading history and bookmarks...</div>;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Test History</h1>
      {data.testHistory.length === 0 ? (
        <p>No test history available.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300 mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Test Title</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Duration (min)</th>
            </tr>
          </thead>
          <tbody>
            {data.testHistory.map((test, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border p-2">{test.title}</td>
                <td className="border p-2">
                  {new Date(test.date).toLocaleDateString()}
                </td>
                <td className="border p-2">{test.score}</td>
                <td className="border p-2">{test.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h1 className="text-2xl font-bold mb-4">Your Bookmarked Questions</h1>
      {data.bookmarks.length === 0 ? (
        <p>No bookmarks available.</p>
      ) : (
        <div className="space-y-4">
          {data.bookmarks.map((bookmark, index) => (
            <div key={index} className="border p-4 rounded shadow">
              {/* Assuming the question is populated */}
              <h2 className="text-xl font-semibold">
                {bookmark.questionId?.text || 'Question text not available'}
              </h2>
              {/* Display additional question details if needed */}
              <p>
                <strong>Topic:</strong>{' '}
                {bookmark.questionId?.topic || 'N/A'}
              </p>
              <p>
                <strong>Bookmarked on:</strong>{' '}
                {new Date(bookmark.addedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

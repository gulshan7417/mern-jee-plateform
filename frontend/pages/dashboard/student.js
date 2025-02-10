import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Sidebar from "@/components/sidebar";

const StudentDashboard = () => {
  const router = useRouter();

  // Dummy user data for demonstration purposes.
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profileImage: "https://picsum.photos/200",
    role: "student",
    _id: "dummy-student-id",
  });

  // State to hold available tests fetched from the backend.
  const [availableTests, setAvailableTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state.
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 10;

  // Edit mode state and temporary fields.
  const [editMode, setEditMode] = useState(false);
  const [updatedFirstName, setUpdatedFirstName] = useState("");
  const [updatedLastName, setUpdatedLastName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedProfileImage, setUpdatedProfileImage] = useState("");

  // Initialize edit fields when editMode is enabled.
  useEffect(() => {
    if (editMode) {
      setUpdatedFirstName(user.firstName);
      setUpdatedLastName(user.lastName);
      setUpdatedEmail(user.email);
      setUpdatedProfileImage(user.profileImage);
    }
  }, [editMode, user]);

  // Handle profile update.
  const handleProfileUpdate = async () => {
    const updatedUser = {
      ...user,
      firstName: updatedFirstName,
      lastName: updatedLastName,
      email: updatedEmail,
      profileImage: updatedProfileImage,
    };
    setUser(updatedUser);
    setEditMode(false);
  };

  const cancelEdit = () => {
    setEditMode(false);
  };

  // Fetch available tests from the API endpoint.
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/tests")
      .then((response) => {
        // Expecting response.data.tests to be an array.
        setAvailableTests(response.data.tests || []);
      })
      .catch((error) => {
        console.error("Error fetching tests:", error);
      });
  }, []);

  // Reset pagination when the search term changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter tests based on the search term.
  const filteredTests = availableTests.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations.
  const totalTests = filteredTests.length;
  const totalPages = Math.ceil(totalTests / testsPerPage);
  const startIndex = (currentPage - 1) * testsPerPage;
  const testsToDisplay = filteredTests.slice(startIndex, startIndex + testsPerPage);

  // Renders the profile image.
  const renderProfileImage = () => {
    const userName = user.firstName || "Unknown";
    const initial = userName.charAt(0).toUpperCase();
    return user.profileImage ? (
      <img
        className="w-24 h-24 rounded-full border-2 border-blue-600 object-cover"
        src={user.profileImage}
        alt="Profile"
      />
    ) : (
      <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-blue-600 bg-blue-100">
        <span className="text-3xl font-bold text-blue-600">{initial}</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Main container */}
        <div className="max-w-4xl mx-auto bg-blue-900 text-white rounded-xl shadow-2xl p-8">
          {/* Page Header */}
          

          {/* Profile Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-6 mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-semibold text-white">
                Welcome, {user.firstName} {user.lastName}!
              </h2>
              <p className="mt-2 text-gray-100">Role: {user.role}</p>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div>{renderProfileImage()}</div>
          </div>

          {/* Editable Profile Form */}
          {editMode && (
            <div className="mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Edit Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={updatedFirstName}
                    onChange={(e) => setUpdatedFirstName(e.target.value)}
                    className="w-full p-2 border text-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={updatedLastName}
                    onChange={(e) => setUpdatedLastName(e.target.value)}
                    className="w-full p-2 text-gray-600 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    className="w-full p-2 text-gray-600 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block  text-gray-600 font-medium mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    value={updatedProfileImage}
                    onChange={(e) => setUpdatedProfileImage(e.target.value)}
                    className="w-full text-gray-600 p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleProfileUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Search Input for Tests */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search tests..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Available Tests Section */}
          <section>
            <h3 className="text-xl text-gray-200 font-semibold text-gray-800 mb-4">
              Available Tests
            </h3>
            <div className="grid gap-6">
              {testsToDisplay.length > 0 ? (
                testsToDisplay.map((test) => (
                  <div
                    key={test._id}
                    className="border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-2xl bg-white transition transform hover:scale-105 duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {test.title || "Untitled Test"}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {test.subject || "N/A"}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-3">
                      {test.description || "No description available."}
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => router.push(`/test`)}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Start Test
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">
                  No tests available.
                </p>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex space-x-2 overflow-x-auto">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-2 rounded-lg transition ${
                        currentPage === idx + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

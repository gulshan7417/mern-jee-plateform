import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Sidebar from "@/components/sidebar";

const AdminPage = () => {
  const router = useRouter();

  // Dummy admin data for demonstration with a random image from picsum.photos.
  const [admin, setAdmin] = useState({
    name: "Admin User",
    email: "admin@example.com",
    profilePhoto: "https://picsum.photos/200",
  });
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode state for the admin profile
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedProfilePhoto, setUpdatedProfilePhoto] = useState("");

  // Sample random questions for showcase
  

  // Simulate fetching data (replace with axios calls to your API if available)
  useEffect(() => {
    // For demonstration, we use dummy data.
    setAdmin({
      name: "Admin User",
      email: "admin@example.com",
      profilePhoto: "https://picsum.photos/200",
    });
    // setQuestions(randomQuestionsData);
    setTests([
      {
        _id: "t1",
        title: "Math Test",
        description:
          "A comprehensive math test covering algebra, geometry, and calculus.",
      },
      {
        _id: "t2",
        title: "Science Test",
        description:
          "A comprehensive science test covering physics, chemistry, and biology.",
      },
    ]);
    setLoading(false);
  }, []);

  // When entering edit mode, initialize edit fields with current admin info.
  useEffect(() => {
    if (editMode) {
      setUpdatedName(admin.name);
      setUpdatedEmail(admin.email);
      setUpdatedProfilePhoto(admin.profilePhoto);
    }
  }, [editMode, admin]);

  // Handle profile update (simulate API update call if needed)
  const handleProfileUpdate = () => {
    const updatedAdmin = {
      ...admin,
      name: updatedName,
      email: updatedEmail,
      profilePhoto: updatedProfilePhoto,
    };
    setAdmin(updatedAdmin);
    setEditMode(false);
  };

  const cancelEdit = () => {
    setEditMode(false);
  };

  // Handler for pushing to the create test page
  const handleCreateTest = (e) => {
    e.preventDefault();
    router.push("/admin/create_test");
  };

  // Helper function to render admin profile image or placeholder.
  const renderProfileImage = () => {
    const initial = admin.name ? admin.name.charAt(0).toUpperCase() : "A";
    return admin.profilePhoto ? (
      <img
        className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow-lg"
        src={admin.profilePhoto}
        alt="Admin Profile"
      />
    ) : (
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 border-4 border-blue-400 shadow-lg">
        <span className="text-3xl font-bold text-blue-600">{initial}</span>
      </div>
    );
  };

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Use the same container style as the student dashboard */}
        <div className="max-w-5xl mx-auto bg-blue-950 text-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

          {/* Admin Profile Section */}
          <section className="mb-8 p-6 border rounded-lg shadow-md bg-blue-950">
            <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>
            {!editMode ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg">
                    <strong>Name:</strong> {admin.name}
                  </p>
                  <p className="text-lg">
                    <strong>Email:</strong> {admin.email}
                  </p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="mt-4 md:mt-0">{renderProfileImage()}</div>
              </div>
            ) : (
              <div className="bg-blue-900 p-6 rounded-lg border border-blue-700">
                <h3 className="text-2xl font-bold mb-4">Edit Admin Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      value={updatedProfilePhoto}
                      onChange={(e) => setUpdatedProfilePhoto(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Create a Test Section */}
          <section className="mb-8 p-6 border rounded-lg shadow-md bg-blue-950">
            <h2 className="text-2xl font-semibold mb-4">Create a Test</h2>
            <button
              onClick={handleCreateTest}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200"
            >
              Create Test
            </button>
          </section>

          {/* Display Questions Section */}
          
          {/* Display Tests Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Existing Tests</h2>
            {tests.length > 0 ? (
              tests.map((t) => (
                <div
                  key={t._id}
                  className="p-4 mb-4 bg-blue-800 border rounded shadow-sm"
                >
                  <h3 className="text-xl font-bold">{t.title}</h3>
                  <p>{t.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-300">No tests created yet.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

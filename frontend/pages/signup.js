import React, { useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = { firstName, lastName, email, password, role };

    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (response.ok) {
        // Redirect based on the role returned from the signup response
        if (data.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/student");
        }
      } else {
        console.error("Error signing up:", data.message);
        alert(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Error occurred during signup:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center flex-1 px-6">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-gray-700 font-medium">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 font-medium">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-700 font-medium">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition">
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5001/api/auth/google", "_self");
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    if (!email || !password) {
      setMessage("Both fields are required.");
      setLoading(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    
      if (!response.ok) {
        const errorText = await response.text();
        setMessage(errorText || "Login failed. Please check your credentials.");
        return;
      }
    
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
    
      if (data.user.role) {
        setMessage("Login successful! Redirecting...");
        localStorage.setItem("userRole", data.user.role);
        router.push(data.user.role === "admin" ? "/dashboard/admin" : "/dashboard/student");
      } else {
        setMessage("Invalid response from server.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Sidebar />
      <div className="flex flex-col justify-center items-center flex-1 px-6">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Welcome Back</h2>
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="relative  ">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-150"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {message && <p className="text-center text-sm text-red-600 mt-4">{message}</p>}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500 uppercase">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition duration-150 flex items-center justify-center"
          >
            <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-white text-red-600 font-bold">G</div>
            Sign in with Google
          </button>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

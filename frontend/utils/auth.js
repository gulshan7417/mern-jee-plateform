import axios from "axios";

export const getAdminStatus = async () => {
  try {
    // Updated URL to use port 5001 and the correct route for current user.
    const res = await axios.get("http://localhost:5001/api/auth/current_user", {
      withCredentials: true,
    });
    return res.data && res.data.role === "admin";
  } catch (err) {
    console.error("Error fetching admin status:", err);
    return false;
  }
};

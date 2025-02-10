require("dotenv").config();
require("./config/passport-setup");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const historyRoutes = require("./routes/history");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/tests");
const createUser = require("./routes/userRoutes");
const loginUser = require("./routes/userRoutes");
const getUserDetails=require("./routes/userRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// ✅ Session
app.use(
  session({
    secret: process.env.COOKIE_KEY || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/auth", createUser);
app.use("/api/auth", loginUser);
app.use("api/auth",getUserDetails);
app.use("/api/submissions", submissionRoutes);
// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

const express = require("express");
const { createUser, loginUser, removeUser, getUserDetails } = require("../controllers/userController");

const router = express.Router();

// Signup Route
router.post("/signup", createUser);

// Login Route
router.post("/login", loginUser);

// User Management Routesx
router.delete("/:userId", removeUser);
router.get("/current_user", getUserDetails);

module.exports = router;

// routes/submissionRoutes.js
const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

// POST route for submitting a test
router.post("/submit", submissionController.submitTest);
router.get("/user/:userId", submissionController.getUserSubmissions);
module.exports = router;

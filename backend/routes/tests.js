const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

// Route to create a new test
router.post("/create", testController.createTest);

// Route to get all tests
router.get("/", testController.getTests);

module.exports = router;

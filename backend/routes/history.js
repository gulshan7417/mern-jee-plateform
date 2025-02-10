const router = require('express').Router();
const TestHistory = require('../models/TestHistory');
const Bookmark = require('../models/Bookmark');

// Middleware example: ensure the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Assuming req.user is set after authentication (using Passport or custom middleware)
  if (req.user) return next();
  res.status(401).json({ error: 'Unauthorized' });
};

// GET /api/history
// Fetch both test history and bookmarks for the current user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Assume req.user._id is available (from Passport or similar)
    const userId = req.user._id;

    // Fetch test history for the user
    const testHistory = await TestHistory.find({ user: userId }).sort({ date: -1 });

    // Fetch bookmarked questions for the user
    const bookmarks = await Bookmark.find({ user: userId })
      .populate('questionId')  // Optionally populate the question details
      .sort({ addedAt: -1 });

    res.json({ testHistory, bookmarks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);

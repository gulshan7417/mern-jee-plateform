const mongoose = require('mongoose');

const TestHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  score: { type: Number, required: true },
  duration: { type: Number, required: true }, // duration in minutes
});

module.exports = mongoose.model('TestHistory', TestHistorySchema);

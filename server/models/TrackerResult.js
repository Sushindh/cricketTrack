const mongoose = require('mongoose');
const TrackerResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('TrackerResult', TrackerResultSchema);

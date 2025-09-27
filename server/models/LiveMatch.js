const mongoose = require('mongoose');

const LiveMatchSchema = new mongoose.Schema({
  teams: String, // e.g., "CSK vs MI"
  startTime: Date,
  status: { type: String, default: 'scheduled' } // 'scheduled', 'live', 'completed'
});

module.exports = mongoose.model('LiveMatch', LiveMatchSchema);

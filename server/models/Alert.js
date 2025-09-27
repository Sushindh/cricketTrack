const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchId: {
    type: String,
    required: true
  },
  alertType: {
    type: String,
    enum: ['match_start', 'match_end', 'score_update'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  triggerTime: {
    type: Date,
    required: true
  },
  sent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);

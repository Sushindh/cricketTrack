const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    favoriteTeams: [String],
    alertsEnabled: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const FavoriteSchema = new mongoose.Schema({
  itemId: { type: String, required: true }, // match or player id
  type: { type: String, required: true },   // 'match' or 'player'
  title: String,
  data: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

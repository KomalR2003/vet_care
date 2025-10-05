const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['pet owner', 'doctor', 'admin'], default: 'pet owner' },
  occupation: { type: String }, // For doctors only
  availability: { type: String }, // For doctors only - e.g., "Mon-Fri, 9am-5pm"
  leaveDays: [{ type: String }], // For doctors only - array of dates
  profile: { type: String, default: '' }, // Profile image URL (optional)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

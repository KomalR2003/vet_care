const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true  // one doctor profile per user
  },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  consultation_fee: { type: Number, required: true },
  available_days: [{ type: String }],   // e.g. ["Mon", "Tue", "Wed"]
  available_times: [{ type: String }],  // e.g. ["9am-12pm", "2pm-6pm"]
  bio: { type: String },
  isVerified: { type: Boolean, default: false },
  leaveDays: [{ type: Date }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);

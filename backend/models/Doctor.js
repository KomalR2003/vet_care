const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true  
  },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  consultation_fee: { type: Number, required: true },
  available_days: [{ type: String }],   
  available_times: [{ type: String }],  
  bio: { type: String },
  isVerified: { type: Boolean, default: false },
  leaveDays: [{ type: Date }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);

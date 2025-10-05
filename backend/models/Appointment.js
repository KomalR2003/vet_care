const mongoose = require('mongoose');

const rescheduleInfoSchema = new mongoose.Schema({
  oldDate: { type: Date },
  newDate: { type: Date },
  reason: { type: String }
}, { _id: false });

const appointmentSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  notes: { type: String },
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  rescheduleInfo: rescheduleInfoSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);

const mongoose = require('mongoose');

const vaccinationRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  vaccine: { type: String, required: true },
  notes: { type: String }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  medicine: { type: String, required: true },
  dosage: { type: String },
  notes: { type: String }
}, { _id: false });

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medical_history: [{ type: String }],
  vaccinationRecords: [vaccinationRecordSchema],
  prescriptions: [prescriptionSchema],
  allergies: [{ type: String }],
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', petSchema);
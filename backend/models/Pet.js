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
  breed: { type: String },
  age: { type: Number },
  weight: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Unknown'] },
  vaccinations: [vaccinationRecordSchema],
  prescriptions: [prescriptionSchema],
  notes: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Virtual populate for reports
petSchema.virtual('reports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'pet'
});

// Ensure virtuals are included in JSON and Object output
petSchema.set('toObject', { virtuals: true });
petSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Pet', petSchema);
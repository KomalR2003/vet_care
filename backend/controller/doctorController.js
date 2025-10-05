const User = require('../models/User');
const Doctor = require('../models/Doctor');

exports.createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'name email phone'); // populate user info
    
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.updateSettings = async (req, res) => {
//   try {
//     // Update the logged-in doctor's settings
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id, 
//       {
//         name: req.body.name,
//         phone: req.body.contact,
//         occupation: req.body.occupation,
//         availability: req.body.availability,
//         leaveDays: req.body.leaveDays
//       }, 
//       { new: true }
//     );
    
//     if (!updatedUser) return res.status(404).json({ error: 'Doctor not found' });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT

    // 1. Update User collection
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        phone: req.body.phone,
        availability: req.body.availability,
        leaveDays: req.body.leaveDays
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Update Doctor collection
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { userId },
      {
        specialization: req.body.specialization,
        experience: req.body.experience,
        consultation_fee: req.body.consultation_fee,
        available_days: req.body.available_days || [],
        available_times: req.body.available_times || [],
        bio: req.body.bio,
        leaveDays: req.body.leaveDays
      },
      { new: true, upsert: true }
    );

    // 3. Return full merged data
    res.json({
      ...updatedUser.toObject(),
      doctorDetails: updatedDoctor
    });

  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(400).json({ error: err.message });
  }
};





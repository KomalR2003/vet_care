const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');   // ⬅️ add this
const Pet = require('../models/Pet');         // ⬅️ if Appointment has pet
const User = require('../models/User');     

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      owner: req.user._id // Add the logged-in user as owner
    };
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'pet owner') {
      query.owner = req.user._id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      query.doctor = doctorProfile._id;
    } else if (req.user.role === 'admin') {
      query = {};
    }

    const appointments = await Appointment.find(query)
      .populate('pet owner report')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name' } // <- get doctor's name
      });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('pet owner report')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name' } // <- get doctor's name
      });

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    
    // Check if user owns this appointment (for pet owners) or is admin/doctor
    if (req.user.role === 'pet owner' && appointment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this appointment' });
    }
    
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const { newDate, reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    appointment.rescheduleInfo = {
      oldDate: appointment.date,
      newDate,
      reason
    };
    appointment.date = newDate;
    appointment.status = 'pending';
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
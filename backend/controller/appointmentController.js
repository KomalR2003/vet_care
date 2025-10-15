const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Pet = require('../models/Pet');
const User = require('../models/User');

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      owner: req.user._id
    };
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    
    // Populate the appointment before sending
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('pet')
      .populate('owner', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' }
      });
    
    // Transform to include flat petName and doctorName
    const aptObj = populatedAppointment.toObject();
    const transformedAppointment = {
      ...aptObj,
      petName: aptObj.pet?.name || 'Unknown Pet',
      doctorName: aptObj.doctor?.userId?.name || 'Unknown Doctor'
    };
    
    res.status(201).json(transformedAppointment);
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
      .populate('pet')
      .populate('owner', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('report');

    // Transform appointments to include flat petName and doctorName
    const transformedAppointments = appointments.map(apt => {
      const aptObj = apt.toObject();
      return {
        ...aptObj,
        petName: aptObj.pet?.name || 'Unknown Pet',
        doctorName: aptObj.doctor?.userId?.name || 'Unknown Doctor'
      };
    });

    res.json(transformedAppointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('pet')
      .populate('owner', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('report');

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    
    const aptObj = appointment.toObject();
    const transformedAppointment = {
      ...aptObj,
      petName: aptObj.pet?.name || 'Unknown Pet',
      doctorName: aptObj.doctor?.userId?.name || 'Unknown Doctor'
    };
    
    res.json(transformedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('pet')
      .populate('owner', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' }
      });
      
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    
    const aptObj = appointment.toObject();
    const transformedAppointment = {
      ...aptObj,
      petName: aptObj.pet?.name || 'Unknown Pet',
      doctorName: aptObj.doctor?.userId?.name || 'Unknown Doctor'
    };
    
    res.json(transformedAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    
    if (req.user.role === 'pet owner' && appointment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this appointment' });
    }
    
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllAppointments = async (req, res) => {
  try {
    const confirmDelete = req.body?.confirmDelete;
    
    if (!confirmDelete) {
      return res.status(400).json({ 
        error: 'Confirmation required. Send { "confirmDelete": true }' 
      });
    }
    
    const result = await Appointment.deleteMany({});
    
    res.json({ 
      message: 'All appointments deleted successfully',
      deletedCount: result.deletedCount 
    });
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
    )
      .populate('pet')
      .populate('owner', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' }
      });
      
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    
    const aptObj = appointment.toObject();
    const transformedAppointment = {
      ...aptObj,
      petName: aptObj.pet?.name || 'Unknown Pet',
      doctorName: aptObj.doctor?.userId?.name || 'Unknown Doctor'
    };
    
    res.json(transformedAppointment);
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
    )
      .populate('pet')
      .populate('owner', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' }
      });
      
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    
    const aptObj = appointment.toObject();
    const transformedAppointment = {
      ...aptObj,
      petName: aptObj.pet?.name || 'Unknown Pet',
      doctorName: aptObj.doctor?.userId?.name || 'Unknown Doctor'
    };
    
    res.json(transformedAppointment);
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
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('pet')
      .populate('owner', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name email' }
      });
    
    const aptObj = populatedAppointment.toObject();
    const transformedAppointment = {
      ...aptObj,
      petName: aptObj.pet?.name || 'Unknown Pet',
      doctorName: aptObj.doctor?.userId?.name || 'Unknown Doctor'
    };
    
    res.json(transformedAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
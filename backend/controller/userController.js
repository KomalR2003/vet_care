const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Pet = require('../models/Pet');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    // Check if user is admin or requesting their own data
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user is a doctor, also fetch doctor profile
    if (user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: user._id });
      return res.json({ ...user.toObject(), doctorProfile });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Check if user is admin or updating their own data
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { name, email, phone, role } = req.body;

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    // Only admin can change roles
    if (role && req.user.role === 'admin') user.role = role;

    await user.save();

    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Only admin can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user is a doctor, delete doctor profile and related data
    if (user.role === 'doctor') {
      // Delete doctor profile
      await Doctor.deleteOne({ userId: user._id });
      
      // Note: You might want to handle appointments and reports differently
      // For example, you could set them to a "deleted doctor" status instead
      // For now, we'll just delete the doctor profile
    }

    // If user is a pet owner, delete their pets and appointments
    if (user.role === 'pet owner') {
      // Delete all pets owned by this user
      const pets = await Pet.find({ owner: user._id });
      const petIds = pets.map(pet => pet._id);
      
      // Delete reports for these pets
      await Report.deleteMany({ pet: { $in: petIds } });
      
      // Delete appointments for these pets
      await Appointment.deleteMany({ owner: user._id });
      
      // Delete the pets
      await Pet.deleteMany({ owner: user._id });
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'User and related data deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
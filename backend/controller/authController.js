const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, specialization  } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { name, email, password: hashedPassword, phone, role };

    if (role === 'doctor' && specialization ) {
      userData.specialization  = specialization ;
    }

    const user = new User(userData);
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    const { password: pwd, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ 
      message: 'User registered', 
      token, 
      user: userWithoutPassword 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    const { password: pwd, ...userWithoutPassword } = user.toObject();
    res.json({ 
      message: 'Login successful', 
      token, 
      user: userWithoutPassword 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

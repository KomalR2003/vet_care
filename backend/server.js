require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

const authRoutes = require('./routes/authRoute.js');
const doctorRoutes = require('./routes/doctorRoute.js');
const petRoutes = require('./routes/petRoute.js');
const appointmentRoutes = require('./routes/appointmentRoute.js');
const reportRoutes = require('./routes/reportRoute.js');
const userRoutes = require('./routes/userRoute.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctorController');
const authenticateToken = require('../middleware/auth');

// CRUD - All routes require authentication
router.post('/', authenticateToken, doctorController.createDoctor);
router.get('/', authenticateToken, doctorController.getDoctors);

// Update profile/settings - for doctors to update their own settings
router.put('/settings', authenticateToken, doctorController.updateSettings);

router.get('/:id', authenticateToken, doctorController.getDoctorById);
router.put('/:id', authenticateToken, doctorController.updateDoctor);
router.delete('/:id', authenticateToken, doctorController.deleteDoctor);



module.exports = router;
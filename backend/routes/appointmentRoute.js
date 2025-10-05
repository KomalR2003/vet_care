const express = require('express');
const router = express.Router();
const appointmentController = require('../controller/appointmentController');
const authenticateToken = require('../middleware/auth');

// CRUD - All routes require authentication
router.post('/', authenticateToken, appointmentController.createAppointment);
router.get('/', authenticateToken, appointmentController.getAppointments);
router.get('/:id', authenticateToken, appointmentController.getAppointmentById);
router.put('/:id', authenticateToken, appointmentController.updateAppointment);
router.delete('/:id', authenticateToken, appointmentController.deleteAppointment);

// Confirm, cancel, reschedule
router.post('/:id/confirm', authenticateToken, appointmentController.confirmAppointment);
router.post('/:id/cancel', authenticateToken, appointmentController.cancelAppointment);
router.post('/:id/reschedule', authenticateToken, appointmentController.rescheduleAppointment);

module.exports = router;
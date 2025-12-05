const express = require('express');
const router = express.Router();
const reportController = require('../controller/reportController');
const authenticateToken = require('../middleware/auth');


router.post('/', authenticateToken, reportController.createReport);

// Get all reports (filtered by user role)
router.get('/', authenticateToken, reportController.getReports);

// Get reports for a specific pet
router.get('/pet/:petId', authenticateToken, reportController.getPetReports);

// Get a single report by ID
router.get('/:id', authenticateToken, reportController.getReportById);

// Generate PDF for a report
router.get('/:id/pdf', authenticateToken, reportController.generateReportPDF);

// Update a report
router.put('/:id', authenticateToken, reportController.updateReport);

// Delete a report
router.delete('/:id', authenticateToken, reportController.deleteReport);

module.exports = router;
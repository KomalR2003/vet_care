const express = require('express');
const router = express.Router();
const reportController = require('../controller/reportController');
const authenticateToken = require('../middleware/auth');

// Create a new report
router.post('/', authenticateToken, reportController.createReport);

// Get all reports (optionally filter by pet, doctor, owner)
router.get('/', authenticateToken, reportController.getReports);

// Get a single report by ID
router.get('/:id', authenticateToken, reportController.getReportById);

// Update a report
router.put('/:id', authenticateToken, reportController.updateReport);

// Delete a report
router.delete('/:id', authenticateToken, reportController.deleteReport);

module.exports = router;
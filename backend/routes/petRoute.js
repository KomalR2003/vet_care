const express = require('express');
const router = express.Router();
const petController = require('../controller/petController');
const authenticateToken = require('../middleware/auth');

// CRUD - All routes require authentication
router.post('/', authenticateToken, petController.createPet);
router.get('/', authenticateToken, petController.getPets);
router.get('/:id', authenticateToken, petController.getPetById);
router.put('/:id', authenticateToken, petController.updatePet);
router.delete('/:id', authenticateToken, petController.deletePet);

// Pet history, vaccinations, prescriptions, etc.
router.get('/:id/history', authenticateToken, petController.getPetHistory);

module.exports = router;
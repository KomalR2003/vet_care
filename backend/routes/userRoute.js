const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticateToken = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authenticateToken);

// Get all users (optional - for admin to see all users)
router.get('/', userController.getAllUsers);

// Get single user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
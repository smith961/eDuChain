const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { login, getProfile, updateProfile } = require('../controllers/auth/authController');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
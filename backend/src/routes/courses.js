const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const {
  getPublishedCourses,
  getCourseById,
  syncCourseFromBlockchain
} = require('../controllers/courses/courseController');

// Public routes
router.get('/published', getPublishedCourses);
router.get('/:id', getCourseById);

// Admin routes (protected)
router.post('/sync', syncCourseFromBlockchain);

module.exports = router;
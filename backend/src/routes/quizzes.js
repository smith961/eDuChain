const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => res.json({ message: 'Quizzes API - Coming soon' }));
router.post('/submit', (req, res) => res.json({ message: 'Submit quiz - Coming soon' }));

module.exports = router;
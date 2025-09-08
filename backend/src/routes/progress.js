const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => res.json({ message: 'Progress API - Coming soon' }));
router.post('/update', (req, res) => res.json({ message: 'Update progress - Coming soon' }));

module.exports = router;
const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Notification endpoints - implementation pending
router.get('/', authenticate, (req, res) => res.json({ message: 'Get notifications - implementation pending' }));
router.put('/:id/read', authenticate, (req, res) => res.json({ message: 'Mark as read - implementation pending' }));
router.delete('/:id', authenticate, (req, res) => res.json({ message: 'Delete notification - implementation pending' }));

module.exports = router;

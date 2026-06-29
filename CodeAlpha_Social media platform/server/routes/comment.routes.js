const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Comment endpoints - implementation pending
router.get('/:postId', (req, res) => res.json({ message: 'Get comments - implementation pending' }));
router.post('/', authenticate, (req, res) => res.json({ message: 'Create comment - implementation pending' }));
router.put('/:id', authenticate, (req, res) => res.json({ message: 'Update comment - implementation pending' }));
router.delete('/:id', authenticate, (req, res) => res.json({ message: 'Delete comment - implementation pending' }));

module.exports = router;

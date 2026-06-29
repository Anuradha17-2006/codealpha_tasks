const express = require('express');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Search endpoints - implementation pending
router.get('/', optionalAuth, (req, res) => res.json({ message: 'Global search - implementation pending' }));
router.get('/users', optionalAuth, (req, res) => res.json({ message: 'Search users - implementation pending' }));
router.get('/posts', optionalAuth, (req, res) => res.json({ message: 'Search posts - implementation pending' }));
router.get('/hashtags', optionalAuth, (req, res) => res.json({ message: 'Search hashtags - implementation pending' }));

module.exports = router;

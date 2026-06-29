const express = require('express');
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/:id', userController.getUser);
router.put('/:id', authenticate, userController.updateProfile);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

module.exports = router;

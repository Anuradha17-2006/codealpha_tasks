const express = require('express');
const { authenticate } = require('../middleware/auth');
const { User, Follower, Notification } = require('../models/index_fixed');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.params.userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    const existingFollow = await Follower.findOne({
      where: { followerId: req.user.id, followingId: req.params.userId }
    });

    if (existingFollow) {
      return res.status(400).json({ success: false, message: 'Already following' });
    }

    await Follower.create({
      id: uuidv4(),
      followerId: req.user.id,
      followingId: req.params.userId,
      createdAt: new Date()
    });

    // Update follower/following counts
    await User.increment('followingCount', { where: { id: req.user.id } });
    await User.increment('followerCount', { where: { id: req.params.userId } });

    // Create notification for the followed user
    const currentUser = await User.findByPk(req.user.id);
    await Notification.create({
      id: uuidv4(),
      recipientId: req.params.userId,
      senderId: req.user.id,
      type: 'follow',
      message: `${currentUser.firstName} ${currentUser.lastName} started following you`,
      relatedId: req.user.id,
      isRead: false,
      created_at: new Date()
    });

    res.status(201).json({ success: true, message: 'User followed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:userId', authenticate, async (req, res) => {
  try {
    const follow = await Follower.findOne({
      where: { followerId: req.user.id, followingId: req.params.userId }
    });

    if (!follow) {
      return res.status(404).json({ success: false, message: 'Not following' });
    }

    await follow.destroy();

    // Update follower/following counts
    await User.decrement('followingCount', { where: { id: req.user.id } });
    await User.decrement('followerCount', { where: { id: req.params.userId } });

    res.json({ success: true, message: 'User unfollowed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
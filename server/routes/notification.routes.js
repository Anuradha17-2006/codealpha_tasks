const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Notification, User, Follower } = require('../models/index_fixed');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get notifications for current user (only from users they follow)
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all users that the current user follows
    const following = await Follower.findAll({
      where: { followerId: userId },
      attributes: ['followingId']
    });
    
    const followingIds = following.map(f => f.followingId);
    
    // Get notifications only from users being followed
    const notifications = await Notification.findAll({
      where: {
        recipientId: userId,
        senderId: followingIds.length > 0 ? followingIds : [null] // Use null if no one is following
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profilePicture']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipientId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await notification.update({ isRead: true });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipientId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create notification (internal use)
router.post('/', authenticate, async (req, res) => {
  try {
    const { recipientId, type, message, relatedId } = req.body;

    const notification = await Notification.create({
      id: uuidv4(),
      recipientId,
      senderId: req.user.id,
      type,
      message,
      relatedId,
      isRead: false,
      created_at: new Date()
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
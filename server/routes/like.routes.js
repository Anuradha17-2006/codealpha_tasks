const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Post, Like, Notification, Follower, User } = require('../models/index_fixed');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/post/:postId', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const existingLike = await Like.findOne({
      where: { userId: req.user.id, postId: req.params.postId }
    });

    if (existingLike) {
      return res.status(400).json({ success: false, message: 'Already liked' });
    }

    await Like.create({
      id: uuidv4(),
      userId: req.user.id,
      postId: req.params.postId,
      createdAt: new Date()
    });

    await post.update({ likesCount: post.likesCount + 1 });

    // Create notification for post owner if they're not the one liking
    if (post.userId !== req.user.id) {
      const currentUser = await User.findByPk(req.user.id);
      await Notification.create({
        id: uuidv4(),
        recipientId: post.userId,
        senderId: req.user.id,
        type: 'like',
        message: `${currentUser.firstName} ${currentUser.lastName} liked your post`,
        relatedId: req.params.postId,
        isRead: false,
        created_at: new Date()
      });
    }

    res.status(201).json({ success: true, message: 'Post liked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/post/:postId', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const like = await Like.findOne({
      where: { userId: req.user.id, postId: req.params.postId }
    });

    if (!like) {
      return res.status(404).json({ success: false, message: 'Like not found' });
    }

    await like.destroy();
    await post.update({ likesCount: Math.max(0, post.likesCount - 1) });

    res.json({ success: true, message: 'Post unliked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
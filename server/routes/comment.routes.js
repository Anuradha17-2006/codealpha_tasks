const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Post, Comment, User, Notification } = require('../models/index_fixed');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profilePicture']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a comment
router.post('/', authenticate, async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ success: false, message: 'postId and content are required' });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      id: uuidv4(),
      userId: req.user.id,
      postId: postId,
      content: content,
      created_at: new Date()
    });

    // Update post comment count
    await post.update({ commentsCount: post.commentsCount + 1 });

    // Get the full comment with author details
    const fullComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profilePicture']
        }
      ]
    });

    // Create notification for post owner if they're not the one commenting
    if (post.userId !== req.user.id) {
      const currentUser = await User.findByPk(req.user.id);
      await Notification.create({
        id: uuidv4(),
        recipientId: post.userId,
        senderId: req.user.id,
        type: 'comment',
        message: `${currentUser.firstName} ${currentUser.lastName} commented on your post`,
        relatedId: postId,
        isRead: false,
        created_at: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment created',
      data: fullComment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a comment
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await comment.update({ content });

    res.json({
      success: true,
      message: 'Comment updated',
      data: comment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a comment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const post = await Post.findByPk(comment.postId);
    await comment.destroy();

    // Update post comment count
    if (post) {
      await post.update({ commentsCount: Math.max(0, post.commentsCount - 1) });
    }

    res.json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Post, Like } = require('../models/index_fixed');
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

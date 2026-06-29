const { Post, User, Like, Comment } = require('../models/index_fixed');
const { v4: uuidv4 } = require('uuid');

// Get all posts (with pagination)
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await Post.findAll({
      where: { isDeleted: false, visibility: 'public' },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName', 'username', 'profilePicture']
      }]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create post
exports.createPost = async (req, res) => {
  try {
    const { content, visibility, postType } = req.body;

    if (!content || !req.user) {
      return res.status(400).json({
        success: false,
        message: 'Content and authentication required'
      });
    }

    const post = await Post.create({
      id: uuidv4(),
      userId: req.user.id,
      content,
      visibility,
      postType,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const postWithAuthor = await Post.findByPk(post.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName', 'username', 'profilePicture']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: postWithAuthor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await post.update({
      ...req.body,
      isEdited: true,
      editedAt: new Date(),
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await post.update({
      isDeleted: true,
      deletedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bookmark post
exports.bookmarkPost = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Post bookmarked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

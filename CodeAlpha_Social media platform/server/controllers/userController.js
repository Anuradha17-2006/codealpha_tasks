const { User, Follower, Post } = require('../models/index_fixed');
const { v4: uuidv4 } = require('uuid');

// Get user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'passwordResetToken', 'twoFactorSecret'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get follower/following counts
    const followerCount = await Follower.count({
      where: { followingId: user.id }
    });

    const followingCount = await Follower.count({
      where: { followerId: user.id }
    });

    const postsCount = await Post.count({
      where: { userId: user.id, isDeleted: false }
    });

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        followerCount,
        followingCount,
        postsCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await user.update({
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      bio: req.body.bio || user.bio,
      location: req.body.location || user.location,
      website: req.body.website || user.website,
      profilePicture: req.body.profilePicture || user.profilePicture,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get followers
exports.getFollowers = async (req, res) => {
  try {
    const followers = await Follower.findAll({
      where: { followingId: req.params.id, isBlocked: false },
      include: [{
        model: User,
        as: 'follower',
        attributes: ['id', 'firstName', 'lastName', 'username', 'profilePicture']
      }]
    });

    res.json({
      success: true,
      data: followers.map(f => f.follower)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get following
exports.getFollowing = async (req, res) => {
  try {
    const following = await Follower.findAll({
      where: { followerId: req.params.id, isBlocked: false },
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'firstName', 'lastName', 'username', 'profilePicture']
      }]
    });

    res.json({
      success: true,
      data: following.map(f => f.following)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

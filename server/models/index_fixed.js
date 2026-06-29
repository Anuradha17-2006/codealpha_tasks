const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// ==================== MODELS ====================

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: DataTypes.STRING(50),
  lastName: DataTypes.STRING(50),
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(30),
    unique: true,
    allowNull: false
  },
  password: DataTypes.STRING(255),
  bio: DataTypes.TEXT,
  location: DataTypes.STRING(100),
  website: DataTypes.STRING(255),
  profilePicture: {
    type: DataTypes.STRING(255),
    defaultValue: 'https://via.placeholder.com/200'
  },
  coverPhoto: DataTypes.STRING(255),
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verificationBadge: {
    type: DataTypes.ENUM('none', 'verified', 'celebrity', 'moderator', 'admin'),
    defaultValue: 'none'
  },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  isModerator: { type: DataTypes.BOOLEAN, defaultValue: false },
  isOnline: { type: DataTypes.BOOLEAN, defaultValue: false },
  lastSeen: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  emailVerificationToken: DataTypes.STRING(255),
  passwordResetToken: DataTypes.STRING(255),
  passwordResetExpires: DataTypes.DATE,
  loginAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  lockUntil: DataTypes.DATE,
  theme: { type: DataTypes.ENUM('light', 'dark'), defaultValue: 'light' },
  twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  twoFactorSecret: DataTypes.STRING(255),
  userLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
  engagementPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isSuspended: { type: DataTypes.BOOLEAN, defaultValue: false },
  suspensionReason: DataTypes.TEXT,
  suspendedUntil: DataTypes.DATE,
  interests: DataTypes.JSON,
  preferences: DataTypes.JSON,
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'users', timestamps: false });


// Post Model
const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },

  postType: {
    type: DataTypes.ENUM('text', 'image', 'video', 'poll', 'gif'),
    defaultValue: 'text'
  },

  visibility: {
    type: DataTypes.ENUM('public', 'followers', 'private'),
    defaultValue: 'public'
  },

  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  editedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  sharesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  engagementScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },

  hashtags: {
    type: DataTypes.JSON,
    allowNull: true
  },

  mentions: {
    type: DataTypes.JSON,
    allowNull: true
  },

  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },

  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'posts',
  timestamps: false
});

// Comment Model
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  postId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  repliesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'comments',
  timestamps: false
});

// Likes Model
const Like = sequelize.define('Like', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: DataTypes.UUID,
  postId: DataTypes.UUID,
  commentId: DataTypes.UUID,
  reactionType: { type: DataTypes.ENUM('like', 'love', 'celebrate', 'funny'), defaultValue: 'like' },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'likes', timestamps: false });

// Followers Model
const Follower = sequelize.define('Follower', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  followerId: DataTypes.UUID,
  followingId: DataTypes.UUID,
  isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'followers', timestamps: false });

// Messages Model
const Message = sequelize.define('Message', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  conversationId: DataTypes.UUID,
  senderId: DataTypes.UUID,
  content: DataTypes.TEXT,
  messageType: { type: DataTypes.ENUM('text', 'image', 'file'), defaultValue: 'text' },
  attachmentUrl: DataTypes.STRING(255),
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt: DataTypes.DATE,
  isEdited: { type: DataTypes.BOOLEAN, defaultValue: false },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'messages', timestamps: false });

// Conversations Model
const Conversation = sequelize.define('Conversation', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user1Id: DataTypes.UUID,
  user2Id: DataTypes.UUID,
  lastMessageId: DataTypes.UUID,
  lastMessageAt: DataTypes.DATE,
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'conversations', timestamps: false });

// Notifications Model
const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: DataTypes.UUID,
  fromUserId: DataTypes.UUID,
  type: { type: DataTypes.ENUM('follow', 'like', 'comment', 'reply', 'mention', 'share'), defaultValue: 'mention' },
  postId: DataTypes.UUID,
  commentId: DataTypes.UUID,
  message: DataTypes.STRING(255),
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt: DataTypes.DATE,
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'notifications', timestamps: false });

// Setup relationships
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

Follower.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follower.belongsTo(User, { foreignKey: 'followingId', as: 'following' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

Conversation.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Conversation.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });

Notification.belongsTo(User, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'fromUserId', as: 'fromUser' });

// Hash password before save
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance methods
User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
  const { password, passwordResetToken, emailVerificationToken, ...data } = this.get();
  return data;
};

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  Follower,
  Message,
  Conversation,
  Notification
};

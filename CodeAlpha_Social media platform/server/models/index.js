const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Post = require('./Post');

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
  }
}, { tableName: 'comments' });

// Like Model
const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  commentId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  reactionType: {
    type: DataTypes.ENUM('like', 'love', 'celebrate', 'funny'),
    defaultValue: 'like'
  }
}, { tableName: 'likes' });

// Reaction Model
const Reaction = sequelize.define('Reaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  commentId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('like', 'love', 'celebrate', 'funny', 'sad', 'angry'),
    allowNull: false
  }
}, { tableName: 'reactions' });

// Follower Model
const Follower = sequelize.define('Follower', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { tableName: 'followers' });

// Message Model
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file'),
    defaultValue: 'text'
  },
  attachmentUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { tableName: 'messages' });

// Conversation Model
const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user1Id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user2Id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  lastMessageId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { tableName: 'conversations' });

// Notification Model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  fromUserId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('follow', 'like', 'comment', 'reply', 'mention', 'share'),
    allowNull: false
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  commentId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { tableName: 'notifications' });

// Hashtag Model
const Hashtag = sequelize.define('Hashtag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tag: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    lowercase: true
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  trendingScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, { tableName: 'hashtags' });

// Bookmark Model
const Bookmark = sequelize.define('Bookmark', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  folderName: {
    type: DataTypes.STRING(100),
    defaultValue: 'Default'
  }
}, { tableName: 'bookmarks' });

// Story Model
const Story = sequelize.define('Story', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  mediaUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video'),
    defaultValue: 'image'
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, { tableName: 'stories' });

// Report Model
const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reportedBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  reportType: {
    type: DataTypes.ENUM('post', 'comment', 'user', 'message'),
    allowNull: false
  },
  reportedItemId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  reportedUserId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  reason: {
    type: DataTypes.ENUM('spam', 'harassment', 'hate_speech', 'violence', 'adult_content', 'misinformation', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'investigating', 'resolved', 'rejected'),
    defaultValue: 'pending'
  },
  actionTaken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  resolvedBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { tableName: 'reports' });

// UserAnalytics Model
const UserAnalytics = sequelize.define('UserAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  profileVisits: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  postImpressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  engagementRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  followerGrowth: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  topPost: {
    type: DataTypes.UUID,
    allowNull: true
  },
  bestDay: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, { tableName: 'user_analytics' });

// PostMedia Model
const PostMedia = sequelize.define('PostMedia', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  mediaUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video', 'gif'),
    allowNull: false
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, { tableName: 'post_media' });

// Set up associations
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'userId' });

Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'postId' });

Comment.hasMany(Like, { foreignKey: 'commentId' });
Like.belongsTo(Comment, { foreignKey: 'commentId' });

Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Follower, { foreignKey: 'followerId', as: 'following' });
User.hasMany(Follower, { foreignKey: 'followingId', as: 'followers' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(PostMedia, { foreignKey: 'postId', as: 'media' });
PostMedia.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Story, { foreignKey: 'userId', as: 'stories' });
Story.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Post,
  Comment,
  Like,
  Reaction,
  Follower,
  Message,
  Conversation,
  Notification,
  Hashtag,
  Bookmark,
  Story,
  Report,
  UserAnalytics,
  PostMedia
};

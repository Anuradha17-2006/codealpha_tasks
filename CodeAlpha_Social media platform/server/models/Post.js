const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 5000]
    }
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
    defaultValue: []
  },
  mentions: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'posts',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['visibility'] },
    { fields: ['created_at'] },
    { fields: ['engagement_score', 'created_at'] }
  ]
});

module.exports = Post;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    lowercase: true,
    validate: {
      isEmail: true
    }
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
      is: /^[a-zA-Z0-9_-]+$/i
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  profilePicture: {
    type: DataTypes.STRING(255),
    defaultValue: 'https://via.placeholder.com/200'
  },
  coverPhoto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationBadge: {
    type: DataTypes.ENUM('none', 'verified', 'celebrity', 'moderator', 'admin'),
    defaultValue: 'none'
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isModerator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastSeen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  emailVerificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  passwordResetToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark'),
    defaultValue: 'light'
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  twoFactorSecret: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  userLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  engagementPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  suspensionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  suspendedUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  interests: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      emailNotifications: true,
      pushNotifications: true,
      privateMessages: 'all',
      showOnlineStatus: true,
      allowMessages: true
    }
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] },
    { fields: ['created_at'] },
    { fields: ['is_verified'] }
  ]
});

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance method to compare passwords
User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Instance method to get user data without sensitive fields
User.prototype.toJSON = function() {
  const { password, passwordResetToken, emailVerificationToken, twoFactorSecret, ...data } = this.get();
  return data;
};

module.exports = User;

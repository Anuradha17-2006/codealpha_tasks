const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../models/index_fixed');
const { sendEmail } = require('../services/emailService');

// Generate Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

// Register
exports.register = async (req, res) => {
  const { firstName, lastName, email, username, password, confirmPassword } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email },
        { username }
      ]
    }
  });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email or username already exists'
    });
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    password,
    emailVerificationToken: verificationToken
  });

  // Send verification email
  try {
    await sendEmail({
      to: email,
      subject: 'Verify Your ConnectSphere Account',
      template: 'verify-email',
      data: {
        firstName,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      }
    });
  } catch (error) {
    console.error('Email send error:', error);
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please verify your email.',
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken
    }
  });
};

// Login
exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    return res.status(429).json({
      success: false,
      message: 'Account is locked. Try again later.'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    // Increment login attempts
    await user.update({
      loginAttempts: user.loginAttempts + 1,
      lockUntil: user.loginAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null
    });

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Reset login attempts
  await user.update({
    loginAttempts: 0,
    lockUntil: null,
    isOnline: true,
    lastSeen: new Date()
  });

  const { accessToken, refreshToken } = generateTokens(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken
    }
  });
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.body;

  const user = await User.findOne({
    where: { emailVerificationToken: token }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token'
    });
  }

  await user.update({
    emailVerified: true,
    emailVerificationToken: null
  });

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await user.update({
    passwordResetToken: hashedToken,
    passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  });

  try {
    await sendEmail({
      to: email,
      subject: 'Reset Your ConnectSphere Password',
      template: 'reset-password',
      data: {
        firstName: user.firstName,
        resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      }
    });
  } catch (error) {
    console.error('Email send error:', error);
  }

  res.json({
    success: true,
    message: 'Password reset link sent to your email'
  });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: new Date() }
    }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  await user.update({
    password,
    passwordResetToken: null,
    passwordResetExpires: null
  });

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
};

// Logout
exports.logout = async (req, res) => {
  if (req.user) {
    await req.user.update({
      isOnline: false,
      lastSeen: new Date()
    });
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Refresh Token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

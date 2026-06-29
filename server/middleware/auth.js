const jwt = require('jsonwebtoken');
const { User } = require('../models/index_fixed');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive || user.isSuspended) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account is inactive'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
    });
  }
};

const refreshTokenHandler = (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (roles.length > 0) {
      let hasRole = false;
      for (let role of roles) {
        if (role === 'admin' && req.user.isAdmin) hasRole = true;
        if (role === 'moderator' && (req.user.isModerator || req.user.isAdmin)) hasRole = true;
        if (role === 'user' && req.user.id) hasRole = true;
      }

      if (!hasRole) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource'
        });
      }
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Continue even if token is invalid
  }
  next();
};

module.exports = {
  authenticate,
  refreshTokenHandler,
  authorize,
  optionalAuth
};

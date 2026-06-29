const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Default error
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let data = null;

  // Validation errors
  if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Validation Error';
    data = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'This record already exists';
    data = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} must be unique`
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    status = 400;
    if (err.code === 'FILE_TOO_LARGE') {
      message = 'File too large';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else {
      message = err.message;
    }
  }

  res.status(status).json({
    success: false,
    message,
    ...(data && { data }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

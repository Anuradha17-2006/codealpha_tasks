const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );

    if (process.env.NODE_ENV === 'development' && req.body && Object.keys(req.body).length > 0) {
      console.log('  Body:', JSON.stringify(req.body).substring(0, 200));
    }
  });

  next();
};

module.exports = requestLogger;

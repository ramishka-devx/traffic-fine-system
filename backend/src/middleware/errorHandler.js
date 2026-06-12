module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Scrub detailed stack traces in production deployment modes for security compliance
  const response = {
    timestamp: new Date().toISOString(),
    status: err.statusCode,
    error: err.status,
    message: err.message,
    path: req.originalUrl,
    traceId: req.headers['x-correlation-id'] || null
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(err.statusCode).json(response);
};
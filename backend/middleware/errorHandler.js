const logger = require('../config/logger');

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Axios/API errors
  if (err.response) {
    statusCode = err.response.status || 500;
    message = err.response.data?.message || err.message;
  } else if (err.status) { // Custom errors from services
    statusCode = err.status;
    message = err.message;
  } else if (err.status === 404 || err.message.includes('not found')) {
      statusCode = 404;
  } else {
      // General Fallback
      statusCode = err.statusCode || 500;
  }

  // Log the error
  logger.error(`[${req.method}] ${req.originalUrl} >> StatusCode: ${statusCode}, Message: ${message}`);
  
  // Expose detailed errors only in development
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;

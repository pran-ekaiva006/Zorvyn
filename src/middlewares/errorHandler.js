const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error for developers
  console.error('❌ ERROR HANDLER:', err);

  // 1. Zod Validation Errors
  if (error.name === 'ZodError') {
    const errorsList = error.issues || error.errors || [];
    const formattedErrors = errorsList.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    error = new AppError('Validation Error', 400);
    error.errors = formattedErrors;
  }

  // 2. Mongoose Validation Error
  if (error.name === 'ValidationError') {
    const formattedErrors = Object.values(error.errors || {}).map((e) => ({
      path: e.path,
      message: e.message,
    }));
    error = new AppError('Validation Error', 400);
    error.errors = formattedErrors;
  }

  // 3. Mongoose Duplicate Key Error
  if (error.code === 11000) {
    const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'Field';
    error = new AppError(`${field} already exists`, 400);
  }

  // 4. Mongoose CastError (Invalid ID)
  if (error.name === 'CastError') {
    error = new AppError(`Invalid ${error.path}: ${error.value}`, 400);
  }

  // 5. JWT Errors
  if (error.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token, please log in again', 401);
  }
  if (error.name === 'TokenExpiredError') {
    error = new AppError('Token expired, please log in again', 401);
  }

  // Final Response formatting
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal Server Error';

  const response = {
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
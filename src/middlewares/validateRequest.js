const { ZodError } = require('zod');

const AppError = require('../utils/AppError');

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      const errorMessages = issues.map(err => err.message).join(', ');
      return next(new AppError(`Validation failed: ${errorMessages}`, 400));
    }
    next(error);
  }
};

module.exports = validateRequest;

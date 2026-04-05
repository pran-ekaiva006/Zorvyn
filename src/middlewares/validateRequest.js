const { ZodError } = require('zod');

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const errorsList = error.issues || error.errors;
      const errors = errorsList.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    next(error);
  }
};

module.exports = validateRequest;

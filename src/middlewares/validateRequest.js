const { ZodError } = require('zod');

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateRequest;

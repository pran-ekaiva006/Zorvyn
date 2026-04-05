const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization header missing or malformed', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      if (!roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
        throw new AppError(`Access denied. Required roles: ${roles.join(', ')}`, 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  verifyToken,
  authorize,
};
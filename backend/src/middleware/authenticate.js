const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError } = require('../common/errors/ConcreteErrors');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed security token'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      stationCode: decoded.stationCode
    };
    next();
  } catch (err) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
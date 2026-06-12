const { validationResult } = require('express-validator');
const AppError = require('../common/errors/AppError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join('; ');
    return next(new AppError(messages, 422));
  }
  next();
};

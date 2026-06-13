const AppError = require('./AppError');

class NotFoundError extends AppError { constructor(message = 'Resource not found') { super(message, 404); } }
class ConflictError extends AppError { constructor(message = 'Resource state conflict') { super(message, 409); } }
class UnauthorizedError extends AppError { constructor(message = 'Authentication failed') { super(message, 401); } }
class ForbiddenError extends AppError { constructor(message = 'Access denied') { super(message, 403); } }

module.exports = { NotFoundError, ConflictError, UnauthorizedError, ForbiddenError };
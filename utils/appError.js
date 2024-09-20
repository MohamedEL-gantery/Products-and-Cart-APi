/**
 * Custom error class
 *
 * @class AppError
 * @extends {Error}
 * 
 * @description Custom error class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // for stack trace in development mode only 
    Error.captureStackTrace(this, this.constructor);  //for stack trace, useful for debugging in both development and production

    }

  static badRequest(message) {
    return new AppError(message, 400);
  }

  static notFound(message) {  
    return new AppError(message, 404);
  } 
}


module.exports = AppError;
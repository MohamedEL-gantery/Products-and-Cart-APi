const asyncHandler = require('express-async-handler');
const joi = require('joi');
const AppError = require('../utils/appError');

const cartSchema = joi.object({
  productId: joi.string().required().messages({
    'string.base': 'Product ID must be a valid string.',
    'any.required': 'Product ID is required.',
  }),
  cartId: joi.string().optional().messages({
    'string.base': 'Cart ID must be a valid string.',
  }),
});

const cartSchemaUpdate=joi.object({
  quantity: joi.number().required().min(1).messages({
    'number.base': 'Quantity must be a number.',
    'any.required': 'Quantity is required.',
    'number.min': 'Quantity must be greater than or equal to 1.',
  }),
});


const createCartValidation = asyncHandler((req, res, next) => {
  const { error } = cartSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Return detailed Joi error messages
    return next(AppError.badRequest(error.details.map(err => err.message).join(', ')));
  }

  next();
});


const updateCartValidation = asyncHandler((req, res, next) => {
  const { error } = cartSchemaUpdate.validate(req.body, { abortEarly: false });

  if (error) {
    // Return detailed Joi error messages
    return next(AppError.badRequest(error.details.map(err => err.message).join(', ')));
  }

  next();
});



module.exports = {
  createCartValidation,
  updateCartValidation,
};

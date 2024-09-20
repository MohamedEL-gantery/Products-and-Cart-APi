const asyncHandler = require('express-async-handler');
const joi = require('joi');
const AppError = require('../utils/appError');


const namePattern = /^[a-zA-Z0-9\s'-]+$/;

const productSchema = joi.object({
  name: joi.string().pattern(namePattern).required().messages({
    'string.pattern.base': 'Name can only contain letters, numbers, spaces, dashes, and apostrophes.',
    'any.required': 'Name is required.',
  }),
  quantity: joi.number().required().messages({
    'number.base': 'Quantity must be a number.',
    'any.required': 'Quantity is required.',
  }),
  image: joi.string().messages({
    'string.base': 'Image must be a string representing the file name.'
  }),
  price: joi.number().required().messages({
    'number.base': 'Price must be a number.',
    'any.required': 'Price is required.',
  }),
  salePrice: joi.number().allow(null).less(joi.ref('price')).messages({
    'number.less': 'Sale price should be less than or equal to the regular price.',
  }),
});

const ProductSchemaUpdate = joi.object({
  name: joi.string().pattern(namePattern).optional().messages({
    'string.pattern.base': 'Name can only contain letters, numbers, spaces, dashes, and apostrophes.',
  }),
  quantity: joi.number().optional().messages({
    'number.base': 'Quantity must be a number.',
  }),
  image: joi.string().optional().messages({
    'string.base': 'Image must be a string representing the file name.',
  }),
  price: joi.number().optional().messages({
    'number.base': 'Price must be a number.',
  }),
  salePrice: joi.number().optional().messages({
    'number.base': 'SalePrice must be number',
  }),
});

// Validation for creating a product
const productValidation = asyncHandler((req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Return detailed Joi error messages
    return next(AppError.badRequest(error.details.map(err => err.message).join(', ')));
  }

  next();
});

// Validation for updating a product
const productUpdateValidation = asyncHandler((req, res, next) => {
  const { error } = ProductSchemaUpdate.validate(req.body, { abortEarly: false });

  if (error) {
    // Return detailed Joi error messages
    return next(AppError.badRequest(error.details.map(err => err.message).join(', ')));
  }

  next();
});

module.exports = {
  productValidation,
  productUpdateValidation,
};

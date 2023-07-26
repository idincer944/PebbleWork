const Joi = require('joi');

const validateCategory = (value, helpers) => {
    const allowedCategories = [
      'charity',
      'education',
      'environment',
      'health',
      'animals',
      'community',
      'other',
    ];
  
    if (!allowedCategories.includes(value)) {
      return helpers.error('any.invalid');
    }
  
    return value;
  };

function validateEvent(Event) {
  const validationSchema = Joi.object({
    name: Joi.string().trim().required().min(3).max(50).messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name is required',
      'any.required': 'Name is required',
      'string.min': 'Name should have a minimum of {#limit} characters',
      'string.max': 'Name should have a maximum of {#limit} characters',
    }),
    location: Joi.string().trim().required().messages({
      'string.base': 'Location must be a string',
      'string.empty': 'Location is required',
      'any.required': 'Location is required',
    }),
    time: Joi.date().required().min(Date.now()).messages({
      'any.required': 'Time is required',
      'date.min': 'Time should be after the current date',
    }),
    description: Joi.string().trim().required().min(10).max(1000).messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'any.required': 'Description is required',
      'string.min': 'Description should have a minimum of {#limit} characters',
      'string.max': 'Description should have a maximum of {#limit} characters',
    }),
    picture: Joi.string()
      .trim()
      .required()
      .max(500000)
      .pattern(/\.(jpg|jpeg|png|gif)$/i)
      .messages({
        'string.base': 'Picture must be a string',
        'string.empty': 'Picture is required',
        'any.required': 'Picture is required',
        'string.max': 'Picture size should not exceed 500KB',
        'string.pattern.base':
          'Invalid picture file type. Only JPG, JPEG, PNG, and GIF are allowed.',
      }),
      category: Joi.string().trim().required().custom(validateCategory).messages({
        'string.base': 'Category must be a string',
        'string.empty': 'Category is required',
        'any.required': 'Category is required',
        'any.invalid': 'Invalid category',
      })
  });

  return validationSchema.validate(Event, { abortEarly: false });
}





function validateUser(user) {
    const validationSchema = Joi.object({
      username: Joi.string().trim().alphanum().min(3).max(50).required().messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username is required',
        'any.required': 'Username is required',
        'string.min': 'Username should have a minimum of {#limit} characters',
        'string.max': 'Username should have a maximum of {#limit} characters',
        'string.alphanum': 'Username must only contain alphanumeric characters',
      }),
      firstname: Joi.string().trim().allow('').max(50).messages({
        'string.base': 'Firstname must be a string',
        'string.max': 'Firstname should have a maximum of {#limit} characters',
      }),
      lastname: Joi.string().trim().allow('').max(50).messages({
        'string.base': 'Lastname must be a string',
        'string.max': 'Lastname should have a maximum of {#limit} characters',
      }),
      password: Joi.string().trim().required().min(6).max(255).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
        'string.min': 'Password should have a minimum of {#limit} characters',
        'string.max': 'Password should have a maximum of {#limit} characters',
      }),
      email: Joi.string().trim().email().required().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address',
      }),
      is_verified: Joi.boolean(),
      registered_at: Joi.date().default(Date.now),
      avatar: Joi.string(),
      created_events: Joi.array().items(Joi.string().hex()),
    });
  
    return validationSchema.validate(user, { abortEarly: false });
  }
  
module.exports = {validateEvent,validateUser};

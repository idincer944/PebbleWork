const Joi = require('joi');

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
  });

  return validationSchema.validate(Event, { abortEarly: false });
}

module.exports = validateEvent;

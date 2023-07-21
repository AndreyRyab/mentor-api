const { celebrate, Joi } = require('celebrate');

const { ERROR_EMAIL_MESSAGE, ERROR_PASSWORD_MESSAGE } = require('../constants');

const validateEmail = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().required().email().messages({
        'string.email': ERROR_EMAIL_MESSAGE,
        'string.required': ERROR_EMAIL_MESSAGE,
      }),
    })
    .unknown(true),
});

const validatePassword = celebrate({
  body: Joi.object()
    .keys({
      password: Joi.string().required().min(7).messages({
        'string.min': ERROR_PASSWORD_MESSAGE,
        'string.required': ERROR_PASSWORD_MESSAGE,
      }),
    })
    .unknown(true),
});

const validateCookies = celebrate({
  headers: Joi.object()
    .keys({
      cookie: Joi.required(),
    })
    .unknown(true),
});

module.exports = {
  validatePassword,
  validateEmail,
  validateCookies,
};

const mongoose = require('../utils/db');

const isEmail = require('validator/lib/isEmail');

const {
  ERROR_EMAIL_MESSAGE,
  ERROR_PASSWORD_MESSAGE,
} = require('../constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, ERROR_EMAIL_MESSAGE],
    validate: {
      validator: (v) => isEmail(v),
      message: ERROR_EMAIL_MESSAGE,
    },
  },
  password: {
    type: String,
    required: [true, ERROR_PASSWORD_MESSAGE],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);

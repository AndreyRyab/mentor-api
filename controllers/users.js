const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');

const User = require('../models/user');

const BadRequestError = require('../errors/bad-req-err');
const DBError = require('../errors/bd-error');
const { ERROR_BAD_REQUEST_MESSAGE, EMAIL_EXIST_MESSAGE } = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  if (!isEmail(req.body.email)) {
    throw new BadRequestError(ERROR_BAD_REQUEST_MESSAGE);
  }
  if (req.body.name === '') {
    throw new BadRequestError(ERROR_BAD_REQUEST_MESSAGE);
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email: req.body.email,
        password: hash,
      }),
    )
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: false, // включать, если разные домены
          secure: true, // когда https. Иначе не будет отдавать куку
        })
        .send(user)
        .end();
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new DBError(EMAIL_EXIST_MESSAGE);
      }
    })
    .catch(next);
};

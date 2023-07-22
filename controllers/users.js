const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');

const User = require('../models/user');

const BadRequestError = require('../errors/bad-req-err');
const DBError = require('../errors/db-error');
const NotFoundError = require('../errors/not-found-err.js');
const AuthError = require('../errors/auth-err')

const {
  ERROR_BAD_REQUEST_MESSAGE,
  ERROR_EMAIL_EXIST,
  ERROR_USER_MESSAGE,
  SUCCESS_MESSAGE,
  ERROR_USER_NOT_FOUND,
} = require('../constants');

const { JWT_SECRET } = process.env;

module.exports.createUser = async (req, res) => {
  if (!isEmail(req.body.email)) {
    throw new BadRequestError(ERROR_BAD_REQUEST_MESSAGE);
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const result = await user.save();
    
    const { password, ...newUser } = await result.toJSON();

    if (newUser._id) {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });

      res.send(newUser);
    }
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      throw new DBError(ERROR_EMAIL_EXIST);
    }
    throw new Error(err.message);
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email }).select('+password');
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BadRequestError(ERROR_BAD_REQUEST_MESSAGE);
    }

    throw new Error(err.message);
  }

  if (!user) {
    throw new NotFoundError(ERROR_USER_NOT_FOUND);
  }

  const isPasswordOk = await bcrypt.compare(password, user.password);

  if (!isPasswordOk) {
    throw new AuthError(ERROR_USER_MESSAGE);
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('jwt', token, {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
    sameSite: true,
    secure: true,
  })

  res.send({ message: SUCCESS_MESSAGE });
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (!user) {
      throw new NotFoundError(ERROR_USER_NOT_FOUND);
    }

    const {password, ...userData} = await user.toJSON();

    res.send(userData);    
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BadRequestError(ERROR_BAD_REQUEST_MESSAGE);
    }
    throw new Error(err.message);
  }
};

module.exports.logOut = async (req, res) => {
  res.clearCookie('jwt');

  res.send({ message: SUCCESS_MESSAGE });
};

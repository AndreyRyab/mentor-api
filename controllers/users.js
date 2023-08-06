const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  ERROR_BAD_REQUEST_MESSAGE,
  ERROR_CREDENTIALS_MESSAGE,
  ERROR_EMAIL_EXIST,
  SUCCESS_MESSAGE,
  ERROR_USER_NOT_FOUND,
  ERROR_COMMON_MESSAGE,
  EMAIL_REFEXP,
  ERROR_EMAIL_MESSAGE,
} = require('../constants');

const { JWT_SECRET } = process.env;

module.exports.createUser = async (req, res) => {
  const isEmail = EMAIL_REFEXP.test(req.body.email);

  if (!isEmail) {
    res.status(401).send({ message: ERROR_EMAIL_MESSAGE });
    return;
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
        sameSite: 'None',
        secure: true,
      });

      res.send(newUser);
    } else {
      res.status(500).send({ message: ERROR_COMMON_MESSAGE });
    }
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      res.status(409).send({ message: ERROR_EMAIL_EXIST });
      return;
    }
    res.status(500).send({ message: ERROR_COMMON_MESSAGE });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email }).select('+password');
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(401).send({ message: ERROR_BAD_REQUEST_MESSAGE });
    }
    res.status(500).send({ message: ERROR_COMMON_MESSAGE });
  }

  if (!user) {
    res.status(404).send({ message: ERROR_USER_NOT_FOUND });
    return;
  }

  const isPasswordOk = await bcrypt.compare(password, user.password);

  if (!isPasswordOk) {
    res.status(401).send({ message: ERROR_CREDENTIALS_MESSAGE });
    return;
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('jwt', token, {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  res.send({ message: SUCCESS_MESSAGE });
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });

    if (!user) {
      res.status(404).send({ message: ERROR_USER_NOT_FOUND });
    }

    const { password, ...userData } = await user.toJSON();

    res.send(userData);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(401).send({ message: ERROR_BAD_REQUEST_MESSAGE });
    }
    res.status(500).send({ message: ERROR_COMMON_MESSAGE });
  }
};

module.exports.logOut = async (req, res) => {
  res.clearCookie('jwt');

  res.send({ message: SUCCESS_MESSAGE });
};

const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth-err');
const { ERROR_AUTH_MESSAGE } = require('../constants');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new AuthError(ERROR_AUTH_MESSAGE);
  }
  const token = req.cookies.jwt;

  let payload;
  
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError(ERROR_AUTH_MESSAGE);
  }
  req.user = payload;
  
  next();
};

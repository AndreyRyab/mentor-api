const { ERROR_SERVER_MESSAGE, SERVER_ERROR_CODE } = require('../constants');

module.exports = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR_CODE, message } = err;

  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR_CODE ? ERROR_SERVER_MESSAGE : message,
  });
  next();
};

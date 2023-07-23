const router = require('express').Router();

const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validateEmail, validatePassword } = require('../middlewares/validation');

const NotFoundError = require('../errors/not-found-err');
const { ERROR_DATA_NOT_FOUND } = require('../constants');

router.post('/signup', validateEmail, validatePassword, createUser);

router.post('/login', validateEmail, login);

router.use(auth);

router.use('/users', auth, require('./users'));

router.use(() => {
  throw new NotFoundError(ERROR_DATA_NOT_FOUND);
});

module.exports = router;

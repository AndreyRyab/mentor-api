const router = require('express').Router();
const { validateCookies } = require('../middlewares/validation');

const { getUser, logOut } = require('../controllers/users');

router.get(
  '/user',
  validateCookies,
  getUser,
);

router.post(
  '/logout',
  validateCookies,
  logOut,
);

module.exports = router;

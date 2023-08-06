const ERROR_COMMON_MESSAGE = 'Что-то пошло не так, попробуйте ещё раз';
const ERROR_BAD_REQUEST_MESSAGE = 'Переданы некорректные данные';
const ERROR_USER_NOT_FOUND = 'Пользователь не найден';
const ERROR_CREDENTIALS_MESSAGE = 'Неправильные почта или пароль';
const ERROR_EMAIL_MESSAGE = 'Нужен email';

const ERROR_PASSWORD_MESSAGE = 'Обязателен пароль от 7 знаков';
const ERROR_EMAIL_EXIST = 'Этот email уже использовал другой пользователь.';
const ERROR_SERVER_MESSAGE = 'Ошибка на сервере';
const ERROR_AUTH_MESSAGE = 'Нужна авторизация';
const ERROR_DATA_NOT_FOUND = 'Увы, ничего не нашли';
const SUCCESS_MESSAGE = 'Успешно';
const SERVER_ERROR_CODE = 500;

const EMAIL_REFEXP = /^([A-Za-z0-9_-]+\.)*[A-Za-z0-9_-]+@[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*\.[A-Za-z]{2,6}$/;

module.exports = {
  ERROR_COMMON_MESSAGE,
  ERROR_BAD_REQUEST_MESSAGE,
  ERROR_CREDENTIALS_MESSAGE,
  ERROR_USER_NOT_FOUND,
  EMAIL_REFEXP,
  ERROR_EMAIL_MESSAGE,

  ERROR_PASSWORD_MESSAGE,
  ERROR_EMAIL_EXIST,
  ERROR_SERVER_MESSAGE,
  ERROR_AUTH_MESSAGE,
  ERROR_DATA_NOT_FOUND,
  SUCCESS_MESSAGE,
  SERVER_ERROR_CODE,
};

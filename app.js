require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const router = require('./routes/index');
const limiter = require('./utils/limiter');
const errorsHandler = require('./errors/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const allowedCors = ['http://localhost:8080'];

const app = express();

app.use(limiter);
app.use(requestLogger);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedCors,
    credentials: true,
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Origin,Content-Type,Accept',
  }),
);

app.use(router, errorLogger, errors(), errorsHandler);

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

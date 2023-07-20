require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const limiter = require('./limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger);
app.use(limiter);

/* const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
); */

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(errorLogger);

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

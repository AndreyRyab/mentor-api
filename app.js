require('dotenv').config();

const express = require('express');

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

app.use(express.json());

app.use(errorLogger);

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

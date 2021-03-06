const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const celebrate = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { urlMatchRegExp } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.post('/signin', celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    email: celebrate.Joi.string().email().required(),
    password: celebrate.Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    name: celebrate.Joi.string().min(2).max(30),
    about: celebrate.Joi.string().min(2).max(30),
    avatar: celebrate.Joi.string().pattern(urlMatchRegExp),
    email: celebrate.Joi.string().email().required(),
    password: celebrate.Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Ошибка 404. Путь не найден.'));
});

app.use(errorLogger);

app.use(celebrate.errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);

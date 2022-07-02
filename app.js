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

const { PORT = 3000 } = process.env;
const app = express();
const urlMatchRexExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(helmet());

/* app.use((req, res, next) => {
  req.user = {
    _id: '62a6e342be0c64b3253849d5',
  };
  next();
}); */

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
    avatar: celebrate.Joi.string().pattern(urlMatchRexExp),
    email: celebrate.Joi.string().email().required(),
    password: celebrate.Joi.string().required(),
  }),
}), createUser);

// app.use(auth);

app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Ошибка 404. Путь не найден.'));
});

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

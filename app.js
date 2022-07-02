const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const celebrate = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62a6e342be0c64b3253849d5',
  };
  next();
});

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
    avatar: celebrate.Joi.string(),
    email: celebrate.Joi.string().email().required(),
    password: celebrate.Joi.string().required(),
  }),
}), createUser);

app.use(usersRoutes);
app.use(cardsRoutes);
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Ошибка 404. Путь не найден.' });
});

app.listen(PORT);

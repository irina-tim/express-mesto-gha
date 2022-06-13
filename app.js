const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62a6e342be0c64b3253849d5',
  };
  next();
});

app.use(usersRoutes);
app.use(cardsRoutes);
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Ошибка 404. Путь не найден.' });
});

app.listen(PORT);

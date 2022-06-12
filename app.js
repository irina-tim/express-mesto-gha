const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
//const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(usersRoutes);
//app.use(cardsRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

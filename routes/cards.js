const router = require('express').Router();
const celebrate = require('celebrate');
const { urlMatchRegExp } = require('../utils/constants');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    name: celebrate.Joi.string().min(2).max(30).required(),
    link: celebrate.Joi.string().pattern(urlMatchRegExp).required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate.celebrate({
  params: celebrate.Joi.object().keys({
    cardId: celebrate.Joi.string().required().length(24).hex(),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate.celebrate({
  params: celebrate.Joi.object().keys({
    cardId: celebrate.Joi.string().required().length(24).hex(),
  }),
}), addLike);

router.delete('/cards/:cardId/likes', celebrate.celebrate({
  params: celebrate.Joi.object().keys({
    cardId: celebrate.Joi.string().required().length(24).hex(),
  }),
}), removeLike);

module.exports = router;

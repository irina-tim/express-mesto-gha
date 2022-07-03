const router = require('express').Router();
const celebrate = require('celebrate');
const { urlMatchRegExp } = require('../utils/constants');

const {
  getUsers,
  getUser,
  getUserInfo,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);

router.get('/users/:userId', celebrate.celebrate({
  params: celebrate.Joi.object().keys({
    userId: celebrate.Joi.string().required().length(24).hex(),
  }),
}), getUser);

router.patch('/users/me', celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    name: celebrate.Joi.string().min(2).max(30).required(),
    about: celebrate.Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    avatar: celebrate.Joi.string().pattern(urlMatchRegExp).required(),
  }),
}), updateAvatar);

module.exports = router;

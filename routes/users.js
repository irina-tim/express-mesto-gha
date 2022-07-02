const router = require('express').Router();
const celebrate = require('celebrate');

const urlMatchRexExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const {
  getUsers,
  getUser,
  getUserInfo,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);

router.get('/:userId', celebrate.celebrate({
  params: celebrate.Joi.object().keys({
    userId: celebrate.Joi.string().required().length(24).hex(),
  }),
}), getUser);

router.patch('/users/me', celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    name: celebrate.Joi.string().min(2).max(30),
    about: celebrate.Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    avatar: celebrate.Joi.string().pattern(urlMatchRexExp).required(),
  }),
}), updateAvatar);

module.exports = router;

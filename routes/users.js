const router = require('express').Router();
const celebrate = require('celebrate');

const {
  getUsers,
  getUser,
  // createUser,
  getUserInfo,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
// router.get('/users/:userId', getUser);
router.get('/:userId', celebrate({
  params: celebrate.Joi.object().keys({
    userId: celebrate.string().required(),
  }),
}), getUser);
// router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;

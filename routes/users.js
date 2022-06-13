const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;

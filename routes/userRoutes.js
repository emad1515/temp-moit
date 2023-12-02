import { Router } from 'express';

import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
  uploadUserAvatar,
} from '../controllers/userController.js';
import {
  forgotPassword,
  // isLoggedIn,
  login,
  logout,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// This route for login don't need protect

// Protect all routes after this middleware
router.use(protect);
// router.use(isLoggedIn);

router.get('/me', getMe, getUser);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', uploadUserAvatar, updateMe);
router.delete('/deleteMe', deleteMe);

// Protect all routes after this middleware to admin
// router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;

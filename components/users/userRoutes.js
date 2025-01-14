// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { ensureAuthenticated } = require('../../middlewares/authMiddleware');
const userController = require('./userController');
const cartRoute = require('../carts/cartRoute');
const orderRoute = require('../orders/orderRoute');
const paymentRoute = require('../payments/paymentRoute');

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.get('/auth/google', authController.googleAuth);

router.get('/auth/google/callback', authController.googleAuthCallback);

router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
router.get('/logout', userController.logout);

router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);

router.get('/reset', authController.getResetPassword);
router.post('/reset', authController.postResetPassword);

router.get('/activate-account', authController.getActivateAccount);
router.post('/activate-account', authController.postActivateAccount);

router.get('/activate', authController.getActivate);
router.post('/activate', authController.postActivate);

router.get('/profile', ensureAuthenticated, userController.profileUser);
router.post('/profile', ensureAuthenticated, userController.postProfileUser);
router.get('/review-user', ensureAuthenticated, userController.reviewUser);

router.use('/order', ensureAuthenticated, orderRoute);
router.use('/cart', ensureAuthenticated, cartRoute);
router.use('/payment', ensureAuthenticated, paymentRoute);

//upload avatar
router.post('/upload-avatar', userController.uploadAvatar);

module.exports = router;

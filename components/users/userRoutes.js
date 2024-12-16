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

router.get('/forgot-password', userController.getForgotPassword);
router.post('/forgot-password', userController.postForgotPassword);

router.get('/verify-otp', userController.getVerifyOtp);
router.post('/verify-otp', userController.postVerifyOtp);

router.get('/reset-password', userController.getResetPassword);
router.post('/reset-password', userController.postResetPassword);

router.get('/profile', ensureAuthenticated, userController.profileUser);
router.post('/profile', ensureAuthenticated, userController.postProfileUser);

router.use('/order', ensureAuthenticated, orderRoute);
router.use('/cart', ensureAuthenticated, cartRoute);
router.use('/payment', ensureAuthenticated, paymentRoute);

module.exports = router;
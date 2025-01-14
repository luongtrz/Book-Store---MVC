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
router.post('/check-banned', authController.checkBannedUser);

router.get('/auth/google', authController.googleAuth);

router.get('/auth/google/callback', authController.googleAuthCallback);

router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
router.get('/logout', userController.logout);

router.get('/profile', ensureAuthenticated, userController.profileUser);
router.post('/profile', ensureAuthenticated, userController.postProfileUser);
router.get('/review-user', ensureAuthenticated, userController.reviewUser);
router.post('/change-password', ensureAuthenticated, userController.changePassword);

router.get('/change-password', ensureAuthenticated, userController.getChangePassword);

router.post('/check-email', userController.checkEmailExists);

router.use('/order', ensureAuthenticated, orderRoute);
router.use('/cart', ensureAuthenticated, cartRoute);
router.use('/payment', ensureAuthenticated, paymentRoute);

module.exports = router;
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { ensureAuthenticated } = require('../../middlewares/authMiddleware');
const userController = require('./userController');

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.get('/auth/google', authController.googleAuth);

router.get('/auth/google/callback', authController.googleAuthCallback);

router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
router.get('/logout', userController.logout);

router.get('/profile', ensureAuthenticated, userController.profileUser);
router.post('/profile', ensureAuthenticated, userController.postProfileUser);
router.get('/cart', ensureAuthenticated, userController.CartUser);
module.exports = router;
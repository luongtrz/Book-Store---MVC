// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.get('/auth/google', authController.googleAuth);

router.get('/auth/google/callback', authController.googleAuthCallback);

module.exports = router;
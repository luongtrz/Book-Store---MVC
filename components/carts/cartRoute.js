// routes/authRoutes.js
const express = require('express');
const cartController = require('./cartController');

const router = express.Router();

//must be from /user/
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/update/:id', cartController.updateCartItem);
router.post('/remove/:id', cartController.removeCartItem);
router.get('/check-status', cartController.checkCartStatus);

router.get('/countCart', cartController.getCartCount);

module.exports = router;
const express = require('express');
const orderController = require('./orderController');
const router = express.Router();

//must be from /user/
router.get('/', orderController.getOrderHistory);

module.exports = router;

const express = require('express');
const orderController = require('./orderController');
const router = express.Router();

router.get('/', orderController.getOrderHistory);

module.exports = router;

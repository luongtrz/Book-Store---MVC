const express = require('express');
const paymentController = require('./paymentController');
const router = express.Router();

//must be from /user/
router.get('/', paymentController.getPaymentPage);
router.post('/submit', paymentController.submitPayment);

module.exports = router;
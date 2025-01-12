const express = require('express');
const paymentController = require('./paymentController');
const router = express.Router();


router.get('/', paymentController.getPaymentPage);
router.post('/submit', paymentController.submitPayment);
module.exports = router;
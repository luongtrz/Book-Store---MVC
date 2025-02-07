const paymentService = require('./paymentService');

exports.getPaymentPage = async (req, res) => {
  try {
    const { cartItems, cartTotal } = await paymentService.getCartItems(req.user.id);
    const { user, contact } = await paymentService.getUserDetails(req.user.id);
    res.render('payment', { cartItems, cartTotal, user, contact });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).send('Error fetching cart items');
  }
};

exports.submitPayment = async (req, res) => {
  try {
    const selectedPaymentMethod = req.body.selectedPaymentMethod;

    if (selectedPaymentMethod === 'zalopay') {
      const paymentResult = await paymentService.processPayment(req.user.id);
      res.redirect(paymentResult.order_url);
    } else if (selectedPaymentMethod === 'COD') {
      const result = await paymentService.processCODPayment(req.user.id);
      if (result.status === 'success') {
        res.render('orderSuccess', { message: 'Đã đặt hàng thành công' });
      } else {
        res.render('orderFailure', { message: 'Đặt hàng không thành công' });
      }
    } else {
      res.status(400).send('Invalid payment method');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Error processing payment');
  }
};

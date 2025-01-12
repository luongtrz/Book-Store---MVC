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
    const paymentResult = await paymentService.processPayment(req.user.id);

    // Redirect user to the ZaloPay payment URL
    res.redirect(paymentResult.order_url);
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Error processing payment');
  }
};

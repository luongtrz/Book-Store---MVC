const orderService = require('./orderService');

exports.getSubmitOrder = async (req, res) => {
  try {
    const orderItems = await orderService.getOrderItems(req.user.id);
    const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    res.render('order', { orderItems, orderTotal });
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).send('Error fetching order items');
  }
};

exports.postSubmitOrder = async (req, res) => {
  try {
    await orderService.createOrder(req.user.id);
    res.redirect('/users/order');
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).send('Error submitting order');
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orderItems = await orderService.getOrderHistory(req.user.id);
    res.render('order', { orderItems });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).send('Error fetching order history');
  }
};
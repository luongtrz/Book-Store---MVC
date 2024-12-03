const { Order, Cart, Book } = require('../../models/model.index');

exports.createOrder = async (userId) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [Book],
    });

    if (!cartItems.length) {
      throw new Error('Cart is empty');
    }

    const orderPromises = cartItems.map(async (item) => {
      return Order.create({
        user_id: userId,
        book_id: item.book_id,
        amount: item.amount,
        total: item.total,
        date_order: new Date(),
      });
    });

    await Promise.all(orderPromises);

    // Clear the cart after creating the order
    await Cart.destroy({ where: { user_id: userId } });

    return { message: 'Order placed successfully' };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Error creating order');
  }
};

exports.getOrderItems = async (userId) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [Book],
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Error fetching orders');
  }
};

exports.getOrderHistory = async (userId) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [Book],
      order: [['date_order', 'DESC']],
    });

    return orders;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw new Error('Error fetching order history');
  }
};
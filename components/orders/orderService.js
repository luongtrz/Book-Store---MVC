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

    const formattedOrders = orders.map(order => {
      const utcDate = new Date(order.date_order);

      // Convert to VN UTC+7 timezone
      const vietnamDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000); // +7 giờ (GMT+7)

      // Format datetime dd/MM
      const formattedDate = vietnamDate.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      });

      return {
        ...order.dataValues,
        date_order: formattedDate,
      };
    });

    console.log('formattedOrders:', formattedOrders);
    return formattedOrders;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw new Error('Error fetching order history');
  }
};



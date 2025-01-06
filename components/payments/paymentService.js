const { User, Cart, Book, Order, Contact } = require('../../models/model.index');

exports.getCartItems = async (userId) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{
        model: Book,
        attributes: ['id', 'title', 'image', 'price', 'author'],
      }],
      raw: true,
      nest: true,
    });

    const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);

    return { cartItems, cartTotal };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Error fetching cart');
  }
};

exports.processPayment = async (userId) => {
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
        //payment_details: paymentDetails,
      });
    });

    await Promise.all(orderPromises);

    // Clear the cart after successful payment
    await Cart.destroy({ where: { user_id: userId } });

    return { message: 'Payment processed successfully' };
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Error processing payment');
  }
};

exports.getUserDetails = async (userId) => {
    try {
      const user = await User.findByPk(userId);
      const contact = await Contact.findOne({ where: { user_id: userId } });
  
      return { user, contact };
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw new Error('Error fetching user details');
    }
  };
const { User, Cart, Book, Order, Contact } = require('../../models/model.index');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');

const config = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY1,
  key2: process.env.ZALOPAY_KEY2,
  endpoint: process.env.ZALOPAY_ENDPOINT,
};

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
      include: Book,
    });

    if (!cartItems.length) {
      throw new Error('Cart is empty');
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

    // Generate order data
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: `user_${userId}`,
      app_time: Date.now(),
      item: JSON.stringify(cartItems.map(item => ({
        id: item.book_id,
        name: item.Book.title,
        price: item.Book.price,
        quantity: item.amount,
      }))),
      embed_data: JSON.stringify({redirecturl: 'http://localhost:5000/list'}),
      amount: totalAmount,
      description: `Bookstore - Payment for order #${transID}`,
      bank_code: "",
    };

    // Create HMAC signature
    const data =
      `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // Send request to ZaloPay
    const response = await axios.post(config.endpoint, null, { params: order });

    if (response.data.return_code !== 1) {
      throw new Error(`ZaloPay Error: ${response.data.return_message}`);
      return response.data;
    }
    if (response.data.return_code === 2) {
      throw new Error(`Payment Failed`);
      return response.data;
    }

    // Save order to database (if needed)
    const orderPromises = cartItems.map(item =>
      Order.create({
        user_id: userId,
        book_id: item.book_id,
        amount: item.amount,
        total: item.total,
        date_order: new Date(),
        payment_id: order.app_trans_id,
        payment_status: 'Paid',        
      })
    );
    await Promise.all(orderPromises);


    // Clear the cart after successful payment
    await Cart.destroy({ where: { user_id: userId } });

    return response.data;
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
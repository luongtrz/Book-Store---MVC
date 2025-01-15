const { User, Cart, Book, Order, Contact } = require('../../models/model.index');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');

// Cấu hình cho ZaloPay
const config = {
  app_id: "2553", // Thay giá trị từ .env vào đây
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL", // Thay giá trị từ .env vào đây
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz", // Thay giá trị từ .env vào đây
  endpoint: "https://sb-openapi.zalopay.vn/v2/create", // URL từ .env
  query_endpoint: "https://sb-openapi.zalopay.vn/v2/query", // URL từ .env
  cancel_endpoint: "https://sb-openapi.zalopay.vn/v2/cancel", // URL từ .env
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

// Hàm kiểm tra trạng thái thanh toán
exports.checkStatusPayment = async (appTransId) => {
  try {
    // Dữ liệu cần gửi tới ZaloPay
    const postData = {
      app_id: config.app_id,
      app_trans_id: appTransId,
    };

    // Tạo chữ ký HMAC
    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // Gửi yêu cầu kiểm tra trạng thái thanh toán tới ZaloPay
    const postConfig = {
      method: 'post',
      url: config.query_endpoint,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(postData),
    };

    const response = await axios(postConfig);

    const { return_code, return_message } = response.data;

    // Log thông tin phản hồi
    console.log('Payment status response:', response.data);

    // Xử lý theo `return_code`
    if (return_code === 1) {
      return { status: 'success', message: 'Payment successful' };
    } else if (return_code === 2) {
      return { status: 'failed', message: 'Payment failed' };
    } else if (return_code === 3) {
      return { status: 'pending', message: 'Payment is pending or processing' };
    } else {
      return { status: 'unknown', message: return_message || 'Unknown status' };
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw new Error('Error checking payment status');
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
    const appTransId = `${moment().format('YYMMDD')}_${transID}`;
    const order = {
      app_id: config.app_id,
      app_trans_id: appTransId,
      app_user: `user_${userId}`,
      app_time: Date.now(),
      item: JSON.stringify(cartItems.map(item => ({
        id: item.book_id,
        name: item.Book.title,
        price: item.Book.price,
        quantity: item.amount,
      }))),
      // embed_data: JSON.stringify({ redirecturl: 'https://book-store-mvc-sandy.vercel.app/list' }),
      embed_data: JSON.stringify({ redirecturl: 'https://book-store-mvc-rho.vercel.app/list' }),
      amount: totalAmount,
      description: `Bookstore - Payment for order #${transID}`,
      bank_code: "",
    };

    // Create HMAC signature
    const data =
      `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // Send payment request to ZaloPay
    const response = await axios.post(config.endpoint, null, { params: order });

    if (response.data.return_code !== 1) {
      return { status: 'failed', message: 'Payment initiation failed', data: response.data };
    }

    // Kiểm tra trạng thái thanh toán
    const status = await this.checkStatusPayment(appTransId);
    console.log('Payment status:', status);

    const cancelResult = await this.cancelPayment(appTransId);
    // Nếu bị hủy thanh toán
    if (status.status === 'failed') {
      return { status: 'cancelled', message: cancelResult.message, data: response.data };
    }
    console.log('\n=== Payment Response Code 2XXXXX ===');
    console.log('Initial return_code:', cancelResult);
    if (status.status === 'pending') {
      // Save order to database
      const orderPromises = cartItems.map(item =>
        Order.create({
          user_id: userId,
          book_id: item.book_id,
          amount: item.amount,
          total: item.total,
          date_order: new Date(),
          payment_id: appTransId,
          payment_status: 'Paid',
          payment_method: 'ZaloPay',
        })
      );
      await Promise.all(orderPromises);

      // Clear the cart
      await Cart.destroy({ where: { user_id: userId } });

      return response.data;
    }

    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Error processing payment');
  }
};

                                        
exports.cancelPayment = async (appTransId) => {
  try {
    const postData = {
      app_id: config.app_id,
      app_trans_id: appTransId,
    };

    // Tạo chữ ký HMAC
    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // Gửi yêu cầu hủy thanh toán tới ZaloPay
    const postConfig = {
      method: 'post',
      url: config.cancel_endpoint,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(postData),
    };

    const response = await axios(postConfig);
    const { return_code, return_message } = response.data;

    console.log('Cancel payment code:', return_code);
    console.log('Cancel payment message:', return_message);
    console.log('Cancel payment response:', response.data);

    if (return_code === 1) {
      return { status: 'success', message: 'Payment cancelled successfully' };
    } else {
      return { status: 'failed', message: return_message || 'Failed to cancel payment' };
    }
  } catch (error) {
    console.error('Error cancelling payment:', error);
    throw new Error('Error cancelling payment');
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

exports.processCODPayment = async (userId) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: Book,
    });

    if (!cartItems.length) {
      throw new Error('Cart is empty');
    }

    const orderPromises = cartItems.map(item =>
      Order.create({
        user_id: userId,
        book_id: item.book_id,
        amount: item.amount,
        total: item.total,
        date_order: new Date(),
        payment_id: null,
        payment_status: 'Unpaid',
        payment_method: 'COD',
      })
    );
    await Promise.all(orderPromises);

    // Clear the cart
    await Cart.destroy({ where: { user_id: userId } });

    return { status: 'success', message: 'Order placed successfully with COD' };
  } catch (error) {
    console.error('Error processing COD payment:', error);
    throw new Error('Error processing COD payment');
  }
};
const cartService = require('./cartService');

exports.getCart = async (req, res) => {
  try {
    const { cartItems, cartTotal } = await cartService.getCartItems(req.user.id);
    res.render('cart', { cartItems, cartTotal });
  } catch (error) {
    res.status(500).send('Error fetching cart');
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { book_id, amount } = req.body;
    await cartService.addToCart(req.user.id, book_id, amount);
    return res.status(200).send({ message: 'Đã thêm vào giỏ hàng thành công' });
  } catch (error) {
    res.status(500).send('Error adding to cart in controller');
  }
};


exports.updateCartItem = async (req, res) => {
  try {
    const { id: bookId } = req.params; // Extract bookId from params
    const userId = req.user.id; // Extract userId from req.user
    const { amount } = req.body;
    await cartService.updateCartItem(bookId, userId, amount);
    res.redirect('/users/cart'); 
  } catch (error) {
    console.error('Error updating cart item in controller:', error);
    res.status(500).send('Error updating cart item in controller');
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    await cartService.removeCartItemByBookID(id);
    res.redirect('/users/cart');
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).send('Error removing cart item');
  }
};

exports.checkCartStatus = async (req, res) => {
  try {
    const totalItems = await cartService.getCartTotalItems(req.user.id);
    if (totalItems === 0) {
      return res.status(200).send({ canCheckout: false, message: 'Không có đơn hàng để thanh toán' });
    }
    res.status(200).send({ canCheckout: true });
  } catch (error) {
    console.error('Error checking cart status:', error);
    res.status(500).send('Error checking cart status');
  }
};

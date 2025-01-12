const { Cart, Book } = require('../../models/model.index');

exports.getCartItems = async (userId) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{
        model: Book,
        attributes: ['id','title', 'image', 'price', 'author'],
      }],
      raw: true,
      nest: true,
    });

    // Tính tổng giá trị giỏ hàng
    const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);

    return { cartItems, cartTotal };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Error fetching cart');
  }
};

exports.addToCart = async (userId, bookId, amount) => {
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const existingCartItem = await Cart.findOne({
      where: { user_id: userId, book_id: bookId },
    });

    if (existingCartItem) {
      const newAmount = existingCartItem.amount + parseInt(amount, 10);
      const total = book.price * newAmount;
      await existingCartItem.update({ amount: newAmount, total });
    } else {
      const total = book.price * amount;
      await Cart.create({
        user_id: userId,
        book_id: bookId,
        amount,
        total,
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error('Error adding to cart');
  }
};

exports.updateCartItem = async (bookId, userId, amount) => {
  try {
    const cartItem = await Cart.findOne({
      where: { user_id: userId, book_id: bookId },
    });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    const book = await Book.findByPk(bookId);
    const total = book.price * amount;

    await cartItem.update({ amount, total });
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error('Error updating cart item');
  }
};

exports.removeCartItemByBookID = async (cartItemId) => {
  try {
    const cartItem = await Cart.findOne({
      where: { book_id: cartItemId },
    });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    await cartItem.destroy();
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw new Error('Error removing cart item');
  }
}


//countCartItems
exports.countCartItems = async (userId) => {
  try {
    const sum = await Cart.sum('amount', {
      where: { user_id: userId },
    });
    return sum || 0;
  } catch (error) {
    console.error('Error summing cart items:', error);
    throw new Error('Error summing cart items');
  }
};

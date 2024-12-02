const userServices = require('./userService');

exports.profileUser = async (req, res) => {
  res.render('profile', { title: 'Profile Page' });
}

exports.CartUser = async (req, res) => {
  res.render('shoppingCart', { title: 'Cart Page' });
}
exports.getSignup = (req, res) => {
  res.render('signup', { title: 'Sign Up Page' });
};

exports.postSignup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
      let user = await userServices.findUserByEmail(email);
      if (user) {
          return res.status(400).render('signup', {error: 'Email đã tồn tại' });
      }

      user = await userServices.createUser(fullName, email, password);
      res.render('signup', {success: 'Đăng kí thành công! Hãy đăng nhập để tiếp tục!' });
  } catch (error) {
      console.error('Error during sign-up:', error);
      res.status(500).send('Server error');
  }   
};

exports.logout = (req, res) => {
  req.logout((err) => {
      if (err) {
          return res.status(500).send('Server error');
      }
      req.session.destroy((err) => {
          if (err) {
              return res.status(500).send('Server error');
          }
          res.clearCookie('connect.sid'); // clear the cookie
          res.redirect('/users/login');
      });
  });
};

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        await userServices.addToCart(req.user.id, productId, quantity);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Server error');
    }
};

exports.updateCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        await userServices.updateCart(req.user.id, productId, quantity);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).send('Server error');
    }
};

exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        await userServices.removeFromCart(req.user.id, productId);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).send('Server error');
    }
};
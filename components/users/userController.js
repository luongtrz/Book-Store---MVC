const userServices = require('./userService');

exports.profileUser = async (req, res) => {
  const user = await userServices.findUserById(req.user.id);
  const contact = await userServices.findContactByUserId(req.user.id);
  console.log('user', user);
  console.log('contact', contact);
  res.render('profile', { title: 'Profile Page', user, contact });
}

exports.getSignup = (req, res) => {
  res.render('signup', { title: 'Sign Up Page' });
};

exports.postProfileUser = async (req, res) => {
  const { name, address, phone } = req.body;
  try {
    await userServices.updateUserProfile(req.user.id, name);
    await userServices.updateUserContact(req.user.id, address, phone);
    res.redirect('/');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Server error');
  }
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
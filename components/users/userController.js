const userServices = require('./userService');
const passport = require('passport');
const upload = require('../../config/multerConfig');

exports.profileUser = async (req, res) => {
  const user = await userServices.findUserById(req.user.id);
  const contact = await userServices.findContactByUserId(req.user.id);
  console.log('user', user);
  console.log('contact', contact);
  res.render('profile', { title: 'Profile Page', user, contact });
}

exports.orderUser = async (req, res) => {
  try {
    const user = (req.user.id);
    const orderItem = await userServices.findBookByUserId(user);
    console.log('book', book);
    res.render('order', { title: 'Order Page',  orderItem});
  }
  catch (error) {
    console.error('Error during order:', error);
    res.status(500).send('Server error');
  }
}

exports.reviewUser = async (req, res) => {
  try {
    const user = await userServices.findUserById(req.user.id);
    res.json({ userId: user.id });
  } catch (error) {
    console.error('Error fetching user for review:', error);
    res.status(500).json({ error: 'Error fetching user for review' });
  }
};

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

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        await userServices.changeUserPassword(req.user.id, oldPassword, newPassword);
        res.render('changePassword', { success: 'Password changed successfully!' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.render('changePassword', { error: error.message });
    }
};

exports.getChangePassword = (req, res) => {
    res.render('changePassword', { title: 'Change Password' });
};

exports.checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;
        console.log('email', email);
        const exists = await userServices.checkEmailExists(email);
        res.json({ exists });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
      const singleUpload = upload.single('avatar');
      singleUpload(req, res, async (err) => {
          if (err) {
              return res.status(400).json({
                  success: false,
                  message: 'Error uploading file',
                  error: err.message,
              });
          }
          const file = req.file;
          console.log('file', file);
          if (!file) {
              return res.status(400).json({
                  success: false,
                  message: 'No file uploaded.',
              });
          }
          const avatarUrl = file.path;
          console.log('avatarUrl', avatarUrl);
          const user = await userServices.updateAvatar(req.user.id, avatarUrl);
          if (!user) {
              return res.status(404).json({
                  success: false,
                  message: 'User not found.'
              })
          }
          return res.status(200).json({
              success: true,
              message: 'Uploaded avatar successfully.',
              data: user
          });
      });
  } catch (error) {
      console.error('Error uploading avatar:', error);
      return res.status(500).json({
          success: false,
          message: 'Failed to upload avatar.',
          error: error.message,
      });
  }
}
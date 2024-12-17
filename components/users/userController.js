const userServices = require('./userService');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
exports.getForgotPassword = (req, res) => {
  res.render('forgotPassword', { title: 'Forgot Password' });
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userServices.findUserByEmail(email);
    if (!user) {
      return res.status(400).render('forgotPassword', { error: 'Email not found' });
    }
    // Implement password reset logic here (e.g., send email with reset link)
    res.render('forgotPassword', { success: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send('Server error');
  }
};

exports.getVerifyOtp = (req, res) => {
  res.render('verifyOtp', { title: 'Verify OTP' });
};

exports.postVerifyOtp = async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await userServices.findUserByOtp(otp);
    if (!user) {
      return res.status(400).render('verifyOtp', { error: 'Invalid OTP' });
    }

    // OTP is valid, redirect to reset password page
    req.session.userId = user.id;
    res.redirect('/reset-password');
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).send('Server error');
  }
};

exports.getResetPassword = (req, res) => {
  res.render('resetPassword', { title: 'Reset Password' });
};

exports.postResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).render('resetPassword', { error: 'Passwords do not match' });
  }

  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(400).render('resetPassword', { error: 'Invalid session' });
    }

    // Update user password
    await userServices.updateUserPassword(userId, password);

    res.render('resetPassword', { success: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send('Server error');
  }
};

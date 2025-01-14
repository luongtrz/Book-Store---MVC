const userServices = require('./userService');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { sign, verify } = require('../_mainview/controllers/jwt');
const { sendForgotPasswordEmail, sendActivateEmail } = require('../_mainview/controllers/mail');


exports.getLogin = (req, res) => {
  res.render('login');
};

exports.login = async (req, res, next) => {
  const { email } = req.body;
  try {
    passport.authenticate('local', async (err, user, info) => {
      console.log('user', user);

      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).render('login', { title: 'Sign In Page', error: 'Invalid email or password' });
      }
      try {
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          req.session.userId = user._id;
          req.session.userEmail = user.email;
          return res.redirect('/');
        });
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    })(req, res, next);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/users/login' }, async (err, user,info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/users/login');
    }
    try {
        const forgot = await userServices.findUserByEmail(user.email);
        
        if (!forgot) {
            return res.status(400).render('forgotPassword', { error: 'Email does not exist please register and activate account' });
        }
        const isBanned = await userServices.isUserBanned(user.email);
        if (isBanned) {
        return res.status(403).render('login', { title: 'Sign In Page', error: 'Your account has been banned.' });
        }
        req.logIn(user, (err) => {
        if (err) {
            return next(err);

        }
        req.session.userEmail = user.email;
        return res.redirect('/');
          });
        } 
    catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  })(req, res, next);
};


exports.getActivateAccount = (req, res) => {
    res.render('activateAccount', { title: 'Activate Account' });
};

 exports.postActivateAccount = async (req, res) => {

    const email = req.body.email;
   try {
       const user = await userServices.findUserByEmail(email);
       if (!user) {
           return res.status(400).render('activateAccount', {error: 'Email does not exist, please register before activating your account.'});
       }
       if (user.activated_status === true) {
            return res.status(400).render('activateAccount', {error: 'Account already activated'});
        }
       const host = req.header('host');
       const activateLink = `${req.protocol}://${host}/users/activate?token=${sign(email)}&email=${email}`;
       
       await sendActivateEmail(user, host, activateLink);
       res.render('activateAccount', { success: 'Activate account link sent to your email' });
   } catch (error) {
       console.error('Error sending email:', error);
         res.status(500).send('Server error');
    } 

 };

 exports.getActivate = (req, res) => {
    const email = req.query.email;
    const token = req.query.token;
    if (!token || !verify(token)) {
        return res.render('activateStatusUser', { expired: true });
    }
    // const user = userServices.findUserByEmail(email);
    // if (!user) {
    //     return res.status(400).render('activateStatusUser', { error: 'User not found' });
    // }
    // user.activated_status = true;
    // await user.save();

    return res.render('activateStatusUser', { email, token });
};
  
exports.postActivate = async (req, res) => {
    const email = req.body.email;
    const token = req.body.token;

    try {
        if (!token || !verify(token)) {
            return res.render('activateStatusUser', { expired: true });
        }

        const user = await userServices.findUserByEmail(email);
        if (!user) {
            return res.status(400).render('activateStatusUser', { error: 'User not found' });
        }

        if (user.activated_status) {
            return res.status(400).render('activateStatusUser', { error: 'Account already activated' });
        }

        console.log('Activating account for user1:', user.activated_status);
        user.activated_status = true; // Đặt trạng thái kích hoạt
        await user.save(); // Lưu vào DB
        console.log('Activating account for user2:', user.activated_status);

        res.render('activateStatusUser', { success: 'Account activated successfully' });
    } catch (error) {
        console.error('Error activating account:', error);
        res.status(500).send('Server error');
    }
};

exports.getResetPassword = (req, res) => {
    const email = req.query.email;
    const token = req.query.token;
    if (!token || !verify(token)) {
        return res.render('resetPassword', { expired: true });
    }
    return res.render('resetPassword', { email, token });
};

exports.postResetPassword = async (req, res) => {
  const email = req.body.email;
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body['confirm-password'];

  // Kiểm tra mật khẩu và xác nhận mật khẩu
  if (password !== confirmPassword) {
      return res.status(400).render('resetPassword', { error: 'Passwords do not match', email, token });
  }

  // Kiểm tra token
  if (!token || !verify(token)) {
      return res.render('resetPassword', { expired: true });
  }
};

exports.checkBannedUser = async (req, res) => {
  console.log('Checking if user is banned by checkbanndeduser');


  try {
    const { email } = req.body;
    const isBanned = await userServices.isUserBanned(email);
    res.json({ banned: isBanned });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.checkEmailExists = async (email) => {
  try {
    return await userServices.checkEmailExists(email);
  } catch (error) {
    throw new Error('Error checking email existence');
  }
};

exports.getForgotPassword = (req, res) => {
    res.render('forgotPassword', { title: 'Forgot Password' });
};

exports.postForgotPassword = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await userServices.findUserByEmail(email);
        if (!user) {
            return res.status(400).render('forgotPassword', { error: 'Email not found' });
        }
        const host = req.header('host');
        const resetLink = `${req.protocol}://${host}/users/reset?token=${sign(email)}&email=${email}`;
        await sendForgotPasswordEmail(user, host, resetLink);
        res.render('forgotPassword', { success: 'Reset password link sent to your email' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Server error');
    }
};

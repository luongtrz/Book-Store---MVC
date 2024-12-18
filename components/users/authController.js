const userServices = require('./userService');
const passport = require('passport');

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log('user', user);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).render('login', { title: 'Sign In Page', error: 'Invalid email or password' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.session.userId = user._id;
        req.session.userEmail = user.email;
        return res.redirect('/');
      });
    })(req, res, next);
};

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/users/login' }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/users/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.userEmail = user.email;
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.getForgotPassword = (req, res) => {
  res.render('forgotPassword', { title: 'Forgot Password' });
};

exports.postForgotPassword = async (req, res) => {
  let  email  = req.body.email;
  let user = await userServices.findUserByEmail(email);
  if (!user) {
    return res.status(400).render('forgotPassword', { error: 'Email not found' });
  }
  const {sign} = require('../_mainview/controllers/jwt');
  const host = req.header('host');
  const resetLink = `${req.protocol}://${host}/users/reset?token=${sign(email)}&email=${email}`;
  //send mail
  const { sendForgotPasswordEmail } = require('../_mainview/controllers/mail');
  sendForgotPasswordEmail(user, host, resetLink)
  .then((result) => {
    console.log('Email sent:', result.body);
    res.render('forgotPassword', { success: 'Reset password link sent to your email' });
  }).catch((error) => {
    console.error('Error sending email:', error);
    res.status(500).send('Server error');
  });


  // const { email } = req.body;
  // try {
  //   const user = await userServices.findUserByEmail(email);
  //   if (!user) {
  //     return res.status(400).render('forgotPassword', { error: 'Email not found' });
  //   }
    
  //   const {sign} = require('./jwt');
  //   const host = req.header('host');
  //   const resetLink = `${req.protocol}://${host}/users/reset?token=${sign(email)}&email=${email}`;

  //   //send mail
  //   const { sendForgotPasswordEmail } = require('./mail');
  //   sendForgotPasswordEmail(user, host, resetLink)
  //   .then((result) => {
  //     console.log('Email sent:', result.body);
  //     res.render('forgotPassword', { success: 'Reset password link sent to your email' });
  //   }).catch((error) => {
  //     console.error('Error sending email:', error);
  //     res.status(500).send('Server error');
  //   });
    
  // } catch (error) {
  //   console.error('Error during password reset:', error);
  //   res.status(500).send('Server error');
  // }
};
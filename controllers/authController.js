const userServices = require('../components/users/userService');
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
  passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.session.userEmail = user.email;
    return res.redirect('/');
  })(req, res, next);
};
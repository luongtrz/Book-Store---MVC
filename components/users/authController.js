const userServices = require('./userService');
const passport = require('passport');

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
  passport.authenticate('google', { failureRedirect: '/users/login' }, async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/users/login');
    }
    try {
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
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  })(req, res, next);
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
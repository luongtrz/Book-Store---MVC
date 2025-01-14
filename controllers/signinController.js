const userServices = require('../components/users/userService');
// const passport = require('passport');

exports.getSignin = (req, res) => {
  res.render('signin', { title: 'Sign In Page' });
};

// exports.postSignin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     console.log('Attempting to sign in with email:', email);

//     const user = await userServices.findUserByEmail(email);
//     if (!user) {
//       console.log('User not found for email:', email);
//       return res.status(400).render('signin', { title: 'Sign In Page', error: 'Invalid email' });
//     }

//     console.log('User found:', user);

//     const isBanned = await userServices.isUserBanned(email);
//     console.log('User banned status:', isBanned);
//     if (isBanned) {
//       return res.status(403).render('signin', { title: 'Sign In Page', banned: true });
//     }

//     const isMatch = await userServices.validatePassword(password, user.password);
//     if (!isMatch) {
//       console.log('Invalid password for email:', email);
//       return res.status(400).render('signin', { title: 'Sign In Page', error: 'Invalid email or password' });
//     }

//     // Save user information in session
//     req.session.userId = user.id;
//     req.session.userEmail = user.email;
//     console.log('User signed in successfully:', email);
//     res.redirect('/home');
//   } catch (error) {
//     console.error('Error during sign in:', error);
//     res.status(500).send('Server error');
//   }
// };


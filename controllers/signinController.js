// const userServices = require('../components/users/userService');
// const passport = require('passport');

// exports.getSignin = (req, res) => {
//     res.render('signin', { title: 'Sign In Page' });
// };

// exports.postSignin = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await userServices.findUserByEmail(email);
//         if (!user) {
//             return res.status(400).render('signin', { title: 'Sign In Page', error: 'Invalid email' });
//         }

//         const isMatch = await userServices.validatePassword(password, user.password);
//         if (!isMatch) {
//             return res.status(400).render('signin', { title: 'Sign In Page', error: 'Invalid email or password' });
//         }

//         // Save user information in session
//         req.session.userId = user._id;
//         req.session.userEmail = user.email;
//         res.redirect('/home');
//     } catch (error) {
//         res.status(500).send('Server error');
//     }
// };


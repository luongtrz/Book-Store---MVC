const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');
const contactController = require('../controllers/contactController');
const listController = require('../controllers/listController');
const signinController = require('../controllers/signinController');
const signupController = require('../controllers/signupController');
const singleController = require('../controllers/singleController');
const logoutController = require('../controllers/logoutController');
const bookController = require('../components/books/bookController');
const userController = require('../components/users/userController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/home', homeController.getHome);
router.get('/', homeController.getHome);
router.get('/about', aboutController.getAbout);
router.get('/contact', contactController.getContact);
router.get('/list/:id', singleController.getBook);
router.get('/list/:id', bookController.getBookById);
router.get('/list', listController.getList);

router.get('/profile', ensureAuthenticated, userController.profileUser);

router.get('/signin', signinController.getSignin);
// router.post('/signin', signinController.postSignin);

router.get('/signup', signupController.getSignup);
router.post('/signup', signupController.postSignup);
router.get('/logout', logoutController.logout);

module.exports = router;
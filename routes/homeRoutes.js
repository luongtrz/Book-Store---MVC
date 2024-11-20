const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');
const contactController = require('../controllers/contactController');
const listController = require('../controllers/listController');
const signinController = require('../controllers/signinController');
const signupController = require('../controllers/signupController');
const bookController = require('../components/books/bookController');

router.get('/home', homeController.getHome);
router.get('/', homeController.getHome);
router.get('/about', aboutController.getAbout);
router.get('/contact', contactController.getContact);
router.get('/list/:id', bookController.getBookById);
router.get('/list', listController.getList);

router.get('/signin', signinController.getSignin);
router.post('/signin', signinController.postSignin);
router.get('/signup', signupController.getSignup);
router.post('/signup', signupController.postSignup);

module.exports = router;
const express = require('express');
const router = express.Router();
const staticController = require('./controllers/staticsController');
const listController = require('./controllers/listController');
const singleController = require('./controllers/singleController');
const bookController = require('../books/bookController');

router.get('/home', staticController.getHome);
router.get('/', staticController.getHome);
router.get('/about', staticController.getAbout);
router.get('/contact', staticController.getContact);
router.get('/list/:id', singleController.getBook);
router.get('/list/:id', bookController.getBookById);
router.get('/list', listController.getList);

module.exports = router;
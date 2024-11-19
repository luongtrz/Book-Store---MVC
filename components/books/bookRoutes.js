// components/books/bookRoutes.js
const express = require('express');
const bookController = require('./bookController');

const router = express.Router();

router.get('/genres', bookController.getGenres);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);

module.exports = router;

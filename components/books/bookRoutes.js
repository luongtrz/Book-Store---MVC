// components/books/bookRoutes.js
const express = require('express');
const bookController = require('./bookController');
const { ensureAuthenticated } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/genres', bookController.getGenres);
router.get('/authors', bookController.getAuthors);
router.get('/prices', bookController.getAuthors);
router.get('/', bookController.getBooks);
router.post('/filter-books', bookController.filterBooks);
router.post('/search', bookController.searchBooks); 
router.post('/search-and-filter', bookController.searchAndFilterBooks);
router.get('/:id', bookController.getBookById);
router.get('/:id/reviews', bookController.getReviews);
router.post('/:id/reviews', ensureAuthenticated, bookController.addReview);

module.exports = router;
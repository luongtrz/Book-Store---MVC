// components/books/bookController.js
const bookService = require('./bookService');

const getBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.render('books', { books, userId: req.session.userId });
  } catch (error) {
    res.status(500).send('Error fetching books');
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookByTitleId(req.params.id);
    console.log(book);
    if (book) {
      const { reviews, totalPages } = await bookService.getReviewsByBookId(req.params.id, 1, 5);
      res.render('singleBook', { book, reviews, totalPages, userId: req.user ? req.user.id : null });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching book with id:' + `${req.params.id}`);
  }
};

const getGenres = async (req, res) => {
  try {
    const genres = await bookService.getGenres();
    res.render('genres', { genres, userId: req.session.userId });
  } catch (error) {
    res.status(500).send('Error fetching genres');
  }
};

const getAuthors = async (req, res) => {
  try {
    const authors = await bookService.getAuthors();
    res.render('authors', { authors, userId: req.session.userId });
  } catch (error) {
    res.status(500).send('Error fetching authors');
  }
};

const getPrices = async (req, res) => {
  try {
    const ratings = await bookService.getPrices();
    res.render('prices', { prices, userId: req.session.userId });
  } catch (error) {
    res.status(500).send('Error fetching prices');
  }
};

const filterBooks = async (req, res) => {
  try {
    const { genre, author, purchaseCount, price, searchText } = req.body;
    const filters = {};

    if (genre && genre !== '') filters.genre = genre;
    if (author && author !== '') filters.author = author;
    
    // Xử lý purchaseCount ranges
    if (purchaseCount && purchaseCount !== '') {
      const [minSold, maxSold] = purchaseCount.split('-').map(Number);
      filters.sold = { 
        $gte: minSold, 
        $lte: maxSold || Infinity 
      };
    }

    // Xử lý price ranges
    if (price && price !== '') {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filters.price = {
        $gte: minPrice,
        $lte: maxPrice || Infinity
      };
    }

    // Xử lý tìm kiếm theo searchText
    if (searchText && searchText !== '') {
      filters.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } }
      ];
    }

    const books = await bookService.filterBooks(filters);
    res.json(books);
  } catch (error) {
    console.error('Error filtering books:', error);
    res.status(500).json({ error: 'Error filtering books' });
  }
};

const searchBooks = async (req, res) => {
  try {
    const { searchText } = req.body;
    const books = await bookService.searchBooks(searchText);
    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Error searching books' });
  }
};

const searchAndFilterBooks = async (req, res) => {
  try {
    const { genre, author, purchaseCount, price, searchText, page = 1, limit = 4 } = req.body;
    const { books, totalPages } = await bookService.searchAndFilterBooks({ genre, author, purchaseCount, price, searchText, page, limit });
    res.json({ books, totalPages });
  } catch (error) {
    console.error('Error searching and filtering books:', error);
    res.status(500).json({ error: 'Error searching and filtering books' });
  }
};

const getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const { reviews, totalPages } = await bookService.getReviewsByBookId(req.params.id, page, limit);
    if (!reviews) {
      console.error('No reviews found');
      return res.status(404).json({ error: 'No reviews found' });
    }
    res.json({ reviews, totalPages });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews', details: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const userId = req.session.userId; // Ensure userId is extracted from the logged-in user
    const review = await bookService.addReview(req.params.id, userId, comment, rating);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error adding review' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  getGenres,
  getAuthors,
  getPrices,
  filterBooks,  
  searchBooks,
  searchAndFilterBooks,
  getReviews,
  addReview,
};

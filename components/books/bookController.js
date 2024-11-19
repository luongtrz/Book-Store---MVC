// components/books/bookController.js
const bookService = require('./bookService');

const getBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.render('books', { books });
  } catch (error) {
    res.status(500).send('Error fetching books');
  }
};


const getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (book) {
      res.render('singleBook', {book});
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
    res.render('genres', { genres });
  } catch (error) {
    res.status(500).send('Error fetching genres');
  }
};

module.exports = {
  getBooks,
  getBookById,
  getGenres,
};

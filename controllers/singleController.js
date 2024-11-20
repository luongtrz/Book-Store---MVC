const bookService = require('../components/books/bookService');

exports.getBook = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (book) {
      const relatedBooks = await bookService.getRelatedBooks(book.genre, book._id);
      res.render('singleBook', { book, relatedBooks });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching book with id:' + `${req.params.id}`);
  }
};
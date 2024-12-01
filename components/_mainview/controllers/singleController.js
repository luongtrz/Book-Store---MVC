const bookService = require('../../books/bookService');

exports.getBook = async (req, res) => {
  try {
    const book = await bookService.getBookByTitleId(req.params.id);
    if (book) {
      console.log('book.id:', book.id);
      const relatedBooks = await bookService.getRelatedBooks(book.genre, book.id);
      res.render('singleBook', { book, relatedBooks });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching book with id:' + `${req.params.id}`);
  }
};
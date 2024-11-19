const bookService = require('../components/books/bookService');

exports.getList = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    const genres = await bookService.getGenres();
    res.render('listBook', {books,genres});
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
};
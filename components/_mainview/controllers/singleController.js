const bookService = require('../../books/bookService');
const userService = require('../../users/userService');

exports.getBook = async (req, res) => {
  try {
    const book = await bookService.getBookByTitleId(req.params.id);
    if (book) {
      console.log('book.id:', book.id);
      const relatedBooks = await bookService.getRelatedBooks(book.genre, book.id);
      
      let contact = null;
      if (req.user) {
        contact = await userService.findContactByUserId(req.user.id);
      }
      res.render('singleBook', { book, relatedBooks,contact });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching book with id:' + `${req.params.id}`);
  }
};
const bookService = require('../../books/bookService');
exports.getList = async (req, res) => {
  try {
    const { genre, author, price, purchaseCount } = req.query;
    
    // Thực hiện lọc sách theo các tham số truyền vào
    const books = await bookService.getAllBooks(genre, author, price, purchaseCount);
    const genres = await bookService.getGenres();
    const authors = await bookService.getAuthors();
    
    const prices = await bookService.getPrices();

    
    console.log('books:', books);
    // res.render('listBook', { authors });
    res.render('listBook', { books, genres, authors, prices });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
};
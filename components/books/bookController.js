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


const getAuthors = async (req, res) => {
  try {
    const authors = await bookService.getAuthors();
    res.render('authors', { authors }); // Render đúng template authors
  } catch (error) {
    res.status(500).send('Error fetching authors');
  }
};

const getPrices = async (req, res) => {
  try {
    const ratings = await bookService.getPrices();
    res.render('prices', { prices }); 
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
module.exports = {
  getBooks,
  getBookById,
  getGenres,
  getAuthors,
  getPrices,
  filterBooks,  
  searchBooks,
  searchAndFilterBooks
  
};

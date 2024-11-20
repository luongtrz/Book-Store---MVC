// components/books/services/bookService.js
const Book = require('../../models/Book');

const getAllBooks = async (genre, author, price, purchaseCount) => {
  try {
    const filters = {};

    if (genre) filters.genre = genre;
    if (author) filters.author = author;
    if (purchaseCount) {
      const [minSold, maxSold] = purchaseCount.split('-').map(Number);
      filters.sold = { $gte: minSold, $lte: maxSold || Infinity };
    }
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filters.price = { $gte: minPrice, $lte: maxPrice || Infinity };
    }

    const books = await Book.find(filters);
    return books;
  } catch (error) {
    throw new Error('Error fetching books');
  }
};

const getBookById = async (id) => {
  try {
    const book = await Book.findOne({ id });
    return book;
  } catch (error) {
    throw new Error('Error fetching book');
  }
};

const getGenres = async () => {
  try {
    const genres = await Book.distinct('genre');
    return genres;
  } catch (error) {
    throw new Error('Error fetching genres');
  }
};

const getAuthors = async () => {
  try {
    const authors = await Book.distinct('author');
    return authors;
  } catch (error) {
    throw new Error('Error fetching authors');
  }
};

const getPrices = async () => {
  try {
    const prices = await Book.distinct('price');
    return prices;
  } catch (error) {
    throw new Error('Error fetching prices');
  }
};



const filterBooks = async (filters) => {
  try {
    const books = await Book.find(filters);
    return books;
  } catch (error) {
    throw new Error('Error filtering books');
  }
};

const searchBooks = async (searchText) => {
  try {
    const searchTerms = searchText.split(' ').map(term => new RegExp(term, 'i'));
    const books = await Book.find({
      $or: [
        { title: { $in: searchTerms } },
        { description: { $in: searchTerms } }
      ]
    });
    return books;
  } catch (error) {
    throw new Error('Error searching books');
  }
};
const searchAndFilterBooks = async ({ genre, author, purchaseCount, price, searchText }) => {
  try {
    const filters = {};

    if (genre) filters.genre = genre;
    if (author) filters.author = author;
    if (purchaseCount) {
      const [minSold, maxSold] = purchaseCount.split('-').map(Number);
      filters.sold = { $gte: minSold, $lte: maxSold || Infinity };
    }
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filters.price = { $gte: minPrice, $lte: maxPrice || Infinity };
    }
    if (searchText) {
      const searchTerms = searchText.split(' ').map(term => new RegExp(term, 'i'));
      filters.$or = [
        { title: { $in: searchTerms } },
        { description: { $in: searchTerms } }
      ];
    }

    const books = await Book.find(filters);
    return books;
  } catch (error) {
    throw new Error('Error searching and filtering books');
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  getGenres,
  getAuthors,
  getPrices,
  filterBooks,
  searchAndFilterBooks // Thêm hàm searchAndFilterBooks vào exports
};
module.exports = {
  getAllBooks,
  getBookById,
  getGenres,
  getAuthors,
  getPrices,
  filterBooks,
  searchBooks,
  searchAndFilterBooks
};

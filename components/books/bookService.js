// components/books/services/bookService.js
const Book = require('../../models/Book');

const getAllBooks = async () => {
  try {
    const books = await Book.find();
    return books;
  } catch (error) {
    throw new Error('Error fetching books');
  }
};

const getBookById = async (id) => {
  try {
    const book = await Book.findOne({id: id});
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

const getRelatedBooks = async (genre, bookId) => {
  try {
    const books = await Book.aggregate([
      { $match: { genre: genre, _id: { $ne: bookId } } },
      { $sample: { size: 4 } }
    ]);
    return books;
  }
  catch (error) {
    throw new Error('Error fetching related books');
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  getGenres,
  getRelatedBooks
};

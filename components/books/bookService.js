// // components/books/bookService.js
// const Book = require('../../models/Book');

// const getAllBooks = async (genre, author, price, purchaseCount) => {
//   try {
//     const filters = {};

//     if (genre) filters.genre = genre;
//     if (author) filters.author = author;
//     if (purchaseCount) {
//       const [minSold, maxSold] = purchaseCount.split('-').map(Number);
//       filters.sold = { $gte: minSold, $lte: maxSold || Infinity };
//     }
//     if (price) {
//       const [minPrice, maxPrice] = price.split('-').map(Number);
//       filters.price = { $gte: minPrice, $lte: maxPrice || Infinity };
//     }

//     const books = await Book.find(filters);
//     return books;
//   } catch (error) {
//     throw new Error('Error fetching books');
//   }
// };

// const getBookById = async (id) => {
//   try {
//     const book = await Book.findOne({ id: id});
//     return book;
//   } catch (error) {
//     throw new Error('Error fetching book');
//   }
// };

// const getRelatedBooks = async (genre, excludeId) => {
//   try {
//     const relatedBooks = await Book.find({ genre, _id: { $ne: excludeId } }).limit(5);
//     return relatedBooks;
//   } catch (error) {
//     throw new Error('Error fetching related books');
//   }
// };

// const getGenres = async () => {
//   try {
//     const genres = await Book.distinct('genre');
//     return genres;
//   } catch (error) {
//     throw new Error('Error fetching genres');
//   }
// };

// const getAuthors = async () => {
//   try {
//     const authors = await Book.distinct('author');
//     return authors;
//   } catch (error) {
//     throw new Error('Error fetching authors');
//   }
// };

// const getPrices = async () => {
//   try {
//     const prices = await Book.distinct('price');
//     return prices;
//   } catch (error) {
//     throw new Error('Error fetching prices');
//   }
// };



// const filterBooks = async (filters) => {
//   try {
//     const books = await Book.find(filters);
//     return books;
//   } catch (error) {
//     throw new Error('Error filtering books');
//   }
// };

// const searchBooks = async (searchText) => {
//   try {
//     const searchTerms = searchText.split(' ').map(term => new RegExp(term, 'i'));
//     const books = await Book.find({
//       $or: [
//         { title: { $in: searchTerms } },
//         { description: { $in: searchTerms } }
//       ]
//     });
//     return books;
//   } catch (error) {
//     throw new Error('Error searching books');
//   }
// };

// const searchAndFilterBooks = async ({ genre, author, purchaseCount, price, searchText, page, limit }) => {
//   const filters = {};

//   if (genre && genre !== '') filters.genre = genre;
//   if (author && author !== '') filters.author = author;
  
//   if (purchaseCount && purchaseCount !== '') {
//     const [minSold, maxSold] = purchaseCount.split('-').map(Number);
//     filters.sold = { 
//       $gte: minSold, 
//       $lte: maxSold || Infinity 
//     };
//   }

//   if (price && price !== '') {
//     const [minPrice, maxPrice] = price.split('-').map(Number);
//     filters.price = {
//       $gte: minPrice,
//       $lte: maxPrice || Infinity
//     };
//   }

//   if (searchText && searchText !== '') {
//     filters.$or = [
//       { title: { $regex: searchText, $options: 'i' } },
//       { description: { $regex: searchText, $options: 'i' } }
//     ];
//   }

//   const skip = (page - 1) * limit;
//   const books = await Book.find(filters).skip(skip).limit(limit);
//   const totalBooks = await Book.countDocuments(filters);
//   const totalPages = Math.ceil(totalBooks / limit);

//   return { books, totalPages };
// };

// module.exports = {
//   getAllBooks,
//   getBookById,
//   getRelatedBooks,
//   getGenres,
//   getAuthors,
//   getPrices,
//   filterBooks,
//   searchBooks,
//   searchAndFilterBooks
// };

// components/books/bookService.js
const {Book} = require('../../models/model.index')
const {Contact} = require('../../models/model.index')
const { Sequelize } = require('sequelize');

const getAllBooks = async (genre, author, price, purchaseCount) => {
  try {
    const filters = {};

    if (genre) filters.genre = genre;
    if (author) filters.author = author;
    if (purchaseCount) {
      const [minSold, maxSold] = purchaseCount.split('-').map(Number);
      filters.sold = { [Sequelize.Op.gte]: minSold, [Sequelize.Op.lte]: maxSold || Infinity };
    }
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filters.price = { [Sequelize.Op.gte]: minPrice, [Sequelize.Op.lte]: maxPrice || Infinity };
    }

    const books = await Book.findAll({ where: filters });
    return books;
  } catch (error) {
    throw new Error('Error fetching books');
  }
};

const getBookByTitleId = async (title_id) => {
  try {
    const book = await Book.findOne({ where: { title_id } });
    //console.log('book services:', book);
    return book;
  } catch (error) {
    throw new Error('Error fetching book by title_id');
  }
};

const getRelatedBooks = async (genre, excludeId) => {
  try {
    const relatedBooks = await Book.findAll({
      where: {
        genre,
        id: { [Sequelize.Op.ne]: excludeId }
      },
      limit: 5
    });
    return relatedBooks;
  } catch (error) {
    throw new Error('Error fetching related books');
  }
};

const getGenres = async () => {
  try {
    const genres = await Book.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('genre')), 'genre']]
    });
    return genres.map(genre => genre.genre);
  } catch (error) {
    throw new Error('Error fetching genres');
  }
};

const getAuthors = async () => {
  try {
    const authors = await Book.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('author')), 'author']]
    });
    //console.log('Fetched authors:', authors); // Add this line to log the fetched authors
    return authors.map(author => author.author);
  } catch (error) {
    console.error('Error fetching authors:', error); // Add this line to log the error
    throw new Error('Error fetching authors');
  }
};

const getPrices = async () => {
  try {
    const prices = await Book.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('price')), 'price']]
    });
    return prices.map(price => price.price);
  } catch (error) {
    throw new Error('Error fetching prices');
  }
};

const filterBooks = async (filters) => {
  try {
    const books = await Book.findAll({ where: filters });
    return books;
  } catch (error) {
    throw new Error('Error filtering books');
  }
};

const searchBooks = async (searchText) => {
  try {
    const searchTerms = searchText.split(' ').map(term => `%${term}%`);
    const books = await Book.findAll({
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.iLike]: { [Sequelize.Op.any]: searchTerms } } },
          { description: { [Sequelize.Op.iLike]: { [Sequelize.Op.any]: searchTerms } } }
        ]
      }
    });
    return books;
  } catch (error) {
    throw new Error('Error searching books');
  }
};

const searchAndFilterBooks = async ({ genre, author, purchaseCount, price, searchText, page, limit }) => {
  const filters = {};

  if (genre && genre !== '') filters.genre = genre;
  if (author && author !== '') filters.author = author;
  if (purchaseCount && purchaseCount !== '') {
    const [minSold, maxSold] = purchaseCount.split('-').map(Number);
    filters.sold = { [Sequelize.Op.gte]: minSold, [Sequelize.Op.lte]: maxSold || Infinity };
  }
  if (price && price !== '') {
    const [minPrice, maxPrice] = price.split('-').map(Number);
    filters.price = { [Sequelize.Op.gte]: minPrice, [Sequelize.Op.lte]: maxPrice || Infinity };
  }
  if (searchText && searchText !== '') {
    const searchTerms = searchText.split(' ').map(term => `%${term}%`);
    filters[Sequelize.Op.or] = [
      { title: { [Sequelize.Op.iLike]: { [Sequelize.Op.any]: searchTerms } } },
      { description: { [Sequelize.Op.iLike]: { [Sequelize.Op.any]: searchTerms } } }
    ];
  }

  const offset = (page - 1) * limit;
  const books = await Book.findAll({ where: filters, offset, limit });
  const totalBooks = await Book.count({ where: filters });
  const totalPages = Math.ceil(totalBooks / limit);

  return { books, totalPages };
};

module.exports = {
  getAllBooks,
  getBookByTitleId,
  getRelatedBooks,
  getGenres,
  getAuthors,
  getPrices,
  filterBooks,
  searchBooks,
  searchAndFilterBooks
};
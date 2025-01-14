// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  description: String,
  image: String,
  price: Number,
  company: String,
  size: String,
  pages: Number,
  rating: String,
  sold: Number,
  genre: String
});

module.exports = mongoose.model('Book', bookSchema);

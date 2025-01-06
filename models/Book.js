// // models/Book.js
// const mongoose = require('mongoose');

// const bookSchema = new mongoose.Schema({
//   id: String,
//   title: String,
//   author: String,
//   description: String,
//   image: String,
//   price: Number,
//   company: String,
//   size: String,
//   pages: Number,
//   rating: String,
//   sold: Number,
//   genre: String
// });

// module.exports = mongoose.model('Book', bookSchema);


// models/Book.js
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sold: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'books',
    schema: 'public',
    timestamps: false,
  });

  Book.associate = (models) => {
    Book.hasMany(models.Cart, {
      foreignKey: 'book_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Book.hasMany(models.Order, {
      foreignKey: 'book_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Book;
};

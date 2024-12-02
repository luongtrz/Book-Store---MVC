const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/postgreDB');

const db = {};

// Read all model files from the models directory
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'model.index.js')  // Filter model files
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes); // Import and initialize model
    db[model.name] = model;  // Add model instance to db object
  });

// Set up associations if any
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Set up associations between models
  }
});

// Ensure Sequelize and sequelize instance are also accessible
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
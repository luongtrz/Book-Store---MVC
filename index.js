require('dotenv').config();
require('pg');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const passport = require('./config/passportConfig');
const applyCorsMiddleware = require('./middlewares/corsMiddleware');
const applyHelmetMiddleware = require('./middlewares/helmetMiddleware');
const sessionMiddleware = require('./middlewares/sessionMiddleware');
const homeRoutes = require('./components/_mainview/mainViewRoute');
const bookRoutes = require('./components/books/bookRoutes');
const userRoutes = require('./components/users/userRoutes');
//const connectDB = require('./config/database');
const configureViewEngine = require('./config/viewEngine'); 
const sequelize = require('./config/postgreDB');

const db = require('./models/model.index');


const app = express();

// // Connect to MongoDB
// connectDB();



//Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('Connection PostgreSQL success.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

// Sync the models with the database
db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
});
// Set the view engine to Handlebars
configureViewEngine(app);

// Middleware
applyCorsMiddleware(app);
applyHelmetMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport and restore authentication state, if any, from the session
app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: false }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Routes set user email
const setUserEmail = require('./middlewares/setUserEmail');
app.use(setUserEmail);

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/', homeRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = app;
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const passport = require('./config/passportConfig'); // Import the configured passport
const applyCorsMiddleware = require('./middlewares/corsMiddleware');
const applyHelmetMiddleware = require('./middlewares/helmetMiddleware');
const sessionMiddleware = require('./middlewares/sessionMiddleware');
const homeRoutes = require('./routes/homeRoutes');
const bookRoutes = require('./components/books/bookRoutes');
const userRoutes = require('./components/users/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Import the authentication routes
const connectDB = require('./config/database');
const configureViewEngine = require('./config/viewEngine');

const app = express();

// Connect to MongoDB
connectDB();

// Set the view engine to Handlebars
configureViewEngine(app);

// Middleware
applyCorsMiddleware(app);
applyHelmetMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport and restore authentication state, if any, from the session
app.use(sessionMiddleware);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Routes set user email
const setUserEmail = require('./middlewares/setUserEmail');
app.use(setUserEmail);

app.use('/', homeRoutes);
app.use('/', authRoutes);

app.use('/books', bookRoutes);
app.use('/users', userRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
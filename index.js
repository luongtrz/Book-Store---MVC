const express = require('express');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');
const applyCorsMiddleware = require('./middlewares/corsMiddleware');
const applyHelmetMiddleware = require('./middlewares/helmetMiddleware');
const homeRoutes = require('./routes/homeRoutes');
const bookRoutes = require('./components/books/bookRoutes');
const userRoutes = require('./components/users/userRoutes');
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

const sessionMiddleware = require('./middlewares/sessionMiddleware');
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

// Routes set user email
const setUserEmail = require('./middlewares/setUserEmail');
app.use(setUserEmail);

app.use('/', homeRoutes);

app.use('/books', bookRoutes);
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
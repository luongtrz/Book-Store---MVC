const express = require('express');
const path = require('path');
const session = require('express-session');
const applyCorsMiddleware = require('./middlewares/corsMiddleware');
const applyHelmetMiddleware = require('./middlewares/helmetMiddleware');
const homeRoutes = require('./routes/homeRoutes');
const bookRoutes = require('./components/books/bookRoutes');
const userRoutes = require('./components/users/userRoutes');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Set the view engine to Handlebars
const { engine } = require('express-handlebars');
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
applyCorsMiddleware(app);
applyHelmetMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'luongtrz',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', homeRoutes);
app.use('/books', bookRoutes);
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionMiddleware = session({
    secret: 'luongtrz',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://luongtrz:luongtrzpass@book.hrsim.mongodb.net/BookStore',
        collectionName: 'sessions'
    })
});

module.exports = sessionMiddleware;
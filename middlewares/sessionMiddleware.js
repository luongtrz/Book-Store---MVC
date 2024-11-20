const session = require('express-session');

const sessionMiddleware = session({
    secret: 'luongtrz',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
});

module.exports = sessionMiddleware;
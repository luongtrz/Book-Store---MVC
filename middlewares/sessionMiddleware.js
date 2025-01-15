// sessionMiddleware.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET ||'luongtrz',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessionsss'
  }),
  cookie: { secure: false } // Set to true if using HTTPS 
});

module.exports = sessionMiddleware;
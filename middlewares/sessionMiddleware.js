// sessionMiddleware.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessionss'
  }),
  cookie: { secure: false } // Set to true if using HTTPS
});

module.exports = sessionMiddleware;
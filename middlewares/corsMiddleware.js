// middlewares/corsMiddleware.js
const cors = require('cors');

module.exports = (app) => {
  app.use(cors());
  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'");
    next();
  });
};

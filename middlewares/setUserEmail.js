const setUserEmail = (req, res, next) => {
    res.locals.userEmail = req.session.userEmail;
    next();
};

module.exports = setUserEmail;
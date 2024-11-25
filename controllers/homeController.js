exports.getHome = (req, res) => {
    res.render('home', { title: 'Home Page', userEmail: req.session.userEmail });
};
exports.getAbout = (req, res) => {
    res.render('about', { title: 'About Page' });
};

exports.getContact = (req, res) => {
    res.render('contact', { title: 'Contact Page' });
};

exports.getHome = (req, res) => {
    res.render('home', { title: 'Home Page', userEmail: req.session.userEmail });
};
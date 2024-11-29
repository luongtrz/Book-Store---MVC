// Description: logout controller.
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Server error');
            }
            res.clearCookie('connect.sid'); // clear the cookie
            res.redirect('/login');
        });
    });
};

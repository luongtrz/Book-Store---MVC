const userServices = require('../components/users/userService');

exports.getSignin = (req, res) => {
    res.render('signin', { title: 'Sign In Page' });
};

exports.postSignin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userServices.findUserByEmail(email);
        if (!user) {
            return res.status(400).render('signin', { title: 'Sign In Page', error: 'Invalid email or password' });
        }

        const isMatch = await userServices.validatePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).render('signin', { title: 'Sign In Page', error: 'Invalid email or password' });
        }

        // Lưu thông tin người dùng trong session
        req.session.userId = user._id;
        res.render('signin', { title: 'Sign In Page', success: 'Login successful!' });
    } catch (error) {
        res.status(500).send('Server error');
    }
};
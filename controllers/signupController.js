const userServices = require('../components/users/userService');

exports.getSignup = (req, res) => {
    res.render('signup', { title: 'Sign Up Page' });
};

exports.postSignup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        let user = await userServices.findUserByEmail(email);
        if (user) {
            return res.status(400).render('signup', {error: 'Email đã tồn tại' });
        }

        user = await userServices.createUser(fullName, email, password);
        res.render('signup', {success: 'Đăng kí thành công! Hãy đăng nhập để tiếp tục!' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).send('Server error');
    }   
};
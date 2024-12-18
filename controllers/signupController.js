const userServices = require('../components/users/userService');

exports.getSignup = (req, res) => {
    res.render('signup', { title: 'Sign Up Page' });
};

exports.postSignup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        let user = await userServices.findUserByEmail(email);
        if (user) {
            return res.status(400).render('signup', { title: 'Sign Up Page', error: 'Email đã tồn tại' });
        }

        await userServices.createUser(fullName, email, password);
        res.render('signup', { title: 'Sign Up Page', success: 'Đăng kí thành công! Vui lòng đăng nhập' });
    } catch (error) {
        res.status(500).send('Server error');
    }   
};
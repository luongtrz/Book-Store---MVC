// components/users/services/userService.js
const User = require('../../models/User');
const bcrypt = require('bcrypt');

const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error('Error finding user by email');
    }
};

const createUser = async (fullName, email, password) => {
    try {
        const user = new User({
            fullName,
            email,
            password
        });
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error creating user');
    }
};

const validatePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error validating password');
    }
};

module.exports = {
    findUserByEmail,
    createUser,
    validatePassword
};

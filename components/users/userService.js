const User = require('../../models/User');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ where: { email } });
    } catch (error) {
        throw new Error('Error finding user by email');
    }
};

const findUserByGoogleId = async (googleId) => {
    try {
        return await User.findOne({ where: { googleId } });
    } catch (error) {
        console.error('Error finding user by Google ID:', error);
        throw new Error('Error finding user by Google ID');
    }
};

const createUser = async (fullName, email, password) => {
    try {
        const user = await User.create({
            username: fullName,
            email,
            password
        });
        return user;
    } catch (error) {
        throw new Error('Error creating user');
    }
};

const createUserWithGoogle = async (fullName, email, googleId) => {
    try {
        const user = await User.create({
            username: fullName,
            email,
            googleId
        });
        return user;
    } catch (error) {
        throw new Error('Error creating user with Google');
    }
};

const findUserById = async (id) => {
    try {
        return await User.findByPk(id);
    } catch (error) {
        throw new Error('Error finding user by ID');
    }
};

const validatePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error validating password');
    }
};

const addToCart = async (userId, productId, quantity) => {
    try {
        const user = await User.findByPk(userId);
        // Logic to add product to user's cart
        // ...
    } catch (error) {
        throw new Error('Error adding to cart');
    }
};

const updateCart = async (userId, productId, quantity) => {
    try {
        const user = await User.findByPk(userId);
        // Logic to update product quantity in user's cart
        // ...
    } catch (error) {
        throw new Error('Error updating cart');
    }
};

const removeFromCart = async (userId, productId) => {
    try {
        const user = await User.findByPk(userId);
        // Logic to remove product from user's cart
        // ...
    } catch (error) {
        throw new Error('Error removing from cart');
    }
};

module.exports = {
    findUserByEmail,
    findUserByGoogleId,
    findUserById,
    createUser,
    createUserWithGoogle,
    validatePassword,
    addToCart,
    updateCart,
    removeFromCart
};
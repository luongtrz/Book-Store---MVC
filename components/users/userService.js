// // components/users/services/userService.js
// const User = require('../../models/User');
// const bcrypt = require('bcrypt');

// const findUserByEmail = async (email) => {
//     try {
//         return await User.findOne({ email });
//     } catch (error) {
//         throw new Error('Error finding user by email');
//     }
// };

// const findUserByGoogleId = async (googleId) => {
//     try {
//       return await User.findOne({ googleId });
//     } catch (error) {
//       throw new Error('Error finding user by Google ID');
//     }
// };

// const createUser = async (fullName, email, password) => {
//     try {
//         const user = new User({
//             username: fullName,
//             email,
//             password
//         });
//         await user.save();
//         return user;
//     } catch (error) {
//         throw new Error('Error creating user');
//     }
// };

// const createUserWithGoogle = async (fullName, email, googleId) => {
//     try {
//         const user = new User({
//             username: fullName,
//             email,
//             googleId
//         });
//         await user.save();
//         return user;
//     } catch (error) {
//         console.error('Error details:', error);
//         throw new Error('Error creating user with Google');
//     }
// };

// const findUserById = async (id) => {
//     try {
//       return await User.findById(id);
//     } catch (error) {
//       throw new Error('Error finding user by ID');
//     }
// };


// const validatePassword = async (password, hashedPassword) => {
//     try {
//         return await bcrypt.compare(password, hashedPassword);
//     } catch (error) {
//         throw new Error('Error validating password');
//     }
// };

// module.exports = {
//     findUserByEmail,
//     findUserByGoogleId,
//     findUserById,
//     createUser,
//     createUserWithGoogle,
//     validatePassword
// };


// components/users/services/userService.js
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

module.exports = {
    findUserByEmail,
    findUserByGoogleId,
    findUserById,
    createUser,
    createUserWithGoogle,
    validatePassword
};
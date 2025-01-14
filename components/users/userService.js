// components/users/services/userService.js
const { User } = require('../../models/model.index')
const { Contact } = require('../../models/model.index')
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
        const user = await User.findByPk(id);
        if (!user) {
            console.error(`User not found with ID: ${id}`);
            throw new Error('User not found');
        }
        // console.log('---User found:', user);
        return user;
    } catch (error) {
        console.error(`Error finding user by ID: ${id}`, error);
        throw new Error('Error finding user by ID');
    }
};

const findContactByUserId = async (userId) => {
    try {
        return await Contact.findOne({ where: { user_id: userId } });
    } catch (error) {
        throw new Error('Error finding contact by user ID');
    }
}
const validatePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error validating password');
    }
};

const updateUserProfile = async (userId, name) => {
    try {
        await User.update({ username: name }, { where: { id: userId } });
    } catch (error) {
        throw new Error('Error updating user profile');
    }
};

const updateUserContact = async (userId, address, phone) => {
    try {
      const contact = await Contact.findOne({ where: { user_id: userId } });
      if (contact) {
        // Update existing contact
        await Contact.update({ address, phone }, { where: { user_id: userId } });
      } else {
        // Create new contact
        await Contact.create({ user_id: userId, address, phone });
      }
    } catch (error) {
      throw new Error('Error updating user contact');
    }
  };
  
  const saveOtp = async (userId, otp) => {
    try {
        // Cập nhật trường `otp` của user với `userId`
        await User.update({ otp }, { where: { id: userId } });
    } catch (error) {
        console.error('Error saving OTP:', error);
        throw new Error('Failed to save OTP for the user');
    }
};


const findUserByOtp = async (otp) => {
    try {
        return await User.findUserByOtp(otp);
    } catch (error) {
        throw new Error('Error finding user by OTP');
    }
};

const updateUserPassword = async (email, newPassword) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }
      console.log('Old password (hashed):', user.password);
      user.password = newPassword; // Trigger `beforeUpdate`
      await user.save();
      console.log('New password (hashed):', user.password);
      console.log(`Password updated successfully for user: ${email}`);
    } catch (error) {
      console.error(`Error updating password for email ${email}:`, error);
      throw new Error('Error updating user password');
    }
  };
  
//update avatar
const updateAvatar = async (userId, avatarUrl) => {
    try {
        console.log('Updating avatar for userId:', userId);
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return null;
        }
        user.avatar = avatarUrl;
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

const isUserBanned = async (email) => {
    console.log('Checking if user is banned:', email);
    try {
        const user = await User.findOne({ where: { email } });
        console.log('User found for banned check:', user);
        return user && user.banned;
    } catch (error) {
        console.error('Error checking if user is banned:', error);
        throw new Error('Error checking if user is banned');
    }
};

const activateUser = async (mail) => {
    try {
        
        const user = await User.findOne({ where: { email: mail } });
        if (!user) {
            throw new Error('User not found');
        }
        user.activated_status = TRUE;
        await user.save();
        return user;
    } catch (error) {
        console.error('Error activating user:', error);
        throw error;
    }
};
const changeUserPassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Old password is incorrect');
        }
        user.password = newPassword; 
        await user.save();
        return user;
    } catch (error) {
        console.error('Error changing password:', error);
        throw new Error('Error changing password');

    }
};

const checkEmailExists = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        return !!user;
    } catch (error) {
        throw new Error('Error checking email existence');
    }
};

module.exports = {
    findUserByEmail,
    findUserByGoogleId,
    findUserById,
    findContactByUserId,
    createUser,
    createUserWithGoogle,
    validatePassword,
    updateUserProfile,
    updateUserContact,
    saveOtp,
    findUserByOtp,
    updateUserPassword,
    updateAvatar,
    isUserBanned,
    activateUser,
    changeUserPassword,
    checkEmailExists
};
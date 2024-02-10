const User = require('../models/User');

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw new Error('Failed to get user by email');
    }
}

module.exports = { getUserByEmail };

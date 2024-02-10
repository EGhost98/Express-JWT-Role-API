const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your_secret_key';

async function registerUser(email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to register user' };
    }
}

async function loginUser(email, password) {
    try {
        const user = await User.findOne({ email });
        if (!user) return { success: false, message: 'User not found' };

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, JWT_SECRET);
            return { success: true, token };
        } else {
            return { success: false, message: 'Invalid credentials' };
        }
    } catch (error) {
        return { success: false, message: 'Internal server error' };
    }
}

module.exports = { registerUser, loginUser };

const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./user');

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiry: { type: Date, required: true }
});

const passowrdResetToken = mongoose.model('passowrdResetToken', tokenSchema);

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

async function saveToken(email, expiry) {
    try {
        const token = generateToken();
        const userId = await User.findOne({ email });
        const newToken = new passowrdResetToken({
            userId,
            token,
            expiry
        });
        await newToken.save();
        return {
            "userId": userId['_id'],
            "token": token,
        };
    } catch (error) {
        console.error('Error saving token:', error);
        throw error;
    }
}

module.exports = { saveToken, passowrdResetToken };

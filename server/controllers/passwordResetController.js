const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const passwordResetToken = require('../models/passwordResetToken');
const zod = require('zod');
const mongoose = require('mongoose');

const emailSchema = zod.string().email();

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email || !emailSchema.safeParse(email).success) 
        {
            return res.status(400).json({ message: 'Invalid email' });
        }
        const token = await passwordResetToken.saveToken(email, Date.now() + 600000);
        const host = req.get('host');
        const resetLink = `http://${host}/api/user/reset-password/${token['userId']}/${token['token']}`; 
        // console.log(resetLink);
        await sendEmail({
            to: email,
            subject: 'Password Reset Link',
            resetLink: resetLink
        });
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function resetPassword(req, res) {
    try {
        const { userId, token } = req.params;
        const { password } = req.body;
        // console.log(userId, token, password);
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const resetToken = await passwordResetToken.passowrdResetToken.findOne({ userId: userId, token:token} );
        // console.log(resetToken);
        if (!resetToken) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const objId = mongoose.Types.ObjectId.createFromHexString(userId);
        const user = await userModel.findById(objId);
        user.password = hashedPassword; // Update the user's password with the hashed password
        await user.save();
        await resetToken.deleteOne({ userId: userId, token: token });
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {resetPassword, forgotPassword};

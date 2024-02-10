const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User } = require('../models/user');


async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const token = 'generated-token';
        const host = req.get('host');
        const resetLink = `host/api/user/reset-password/${token}`; 
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


async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;

        
        const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {resetPassword, forgotPassword};

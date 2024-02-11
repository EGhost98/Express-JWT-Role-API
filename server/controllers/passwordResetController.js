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
        if (!email)
            return res.status(400).json({ message: 'Email is required' });
        if (!emailSchema.safeParse(email).success) 
            return res.status(400).json({ message: 'Invalid email' });
        const user = await userModel.findOne({email});
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const token = await passwordResetToken.saveToken(email, Date.now() + 600000);
        const host = req.get('host');
        const resetLink = `http://${host}/api/user/reset-password/${token['userId']}/${token['token']}`; 

        // // Uncomment the following line to send the email
        // await sendEmail({
        //     to: email,
        //     subject: 'Password Reset Link',
        //     resetLink: resetLink
        // });
        // res.status(200).json({ message: 'Password reset email sent successfully'});

        // Comment the following line when sending email
        res.status(200).json({ message: 'Password reset email sent successfully' , resetLink: resetLink});
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const HexStringSchema = zod.string().refine(value => {
    return value.length === 64 && /^[0-9a-fA-F]+$/.test(value);
    }, {
    message: "Invalid hexadecimal string",
    });

async function resetPassword(req, res) {
    try {
        const { userId, token } = req.params;
        const { password } = req.body;
        if (HexStringSchema.safeParse(token).success === false)
            return res.status(400).json({ message: 'Invalid token' });
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const resetToken = await passwordResetToken.passowrdResetToken.findOne({ userId: userId, token:token} );
        // console.log(resetToken);
        if (!resetToken) {
            return res.status(400).json({ message: 'Invalid token or UserID' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const objId = mongoose.Types.ObjectId.createFromHexString(userId);
        const user = await userModel.findById(objId);
        user.password = hashedPassword;
        await user.save();
        await resetToken.deleteOne({ userId: userId, token: token });
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {resetPassword, forgotPassword};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const TokenBlacklist = require('../models/TokenBlacklist');
const { z } = require('zod');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const emailSchema = z.string().email();

async function register(req, res) {
    try {
        const { email, password } = req.body;
        if(!email || !password) 
            return res.status(400).json({ message: 'Email and password are required' });
        if(!emailSchema.safeParse(email).success) 
            return res.status(400).json({ message: 'Invalid email' });
        const duplicate = await User.findOne({ email });
        if (duplicate) 
            return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if(!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });
        if(!emailSchema.safeParse(email).success)
            return res.status(400).json({ message: 'Invalid email' });
        const user = await User.findOne({ email });
        if (!user) 
            return res.status(404).json({ message: 'User not found' });
        if (await bcrypt.compare(password, user.password)) {
            const access = generateAccessToken({ email: user.email, role: user.role, token_type: 'access'});
            const refresh = generateRefreshToken({ email: user.email, role: user.role, token_type: 'refresh'});
            res.json({"message" : "Logged In SuccesFully", access, refresh });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

function generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

async function refreshToken(req, res) {
    const refreshToken = req.body['refresh'];

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided.'});
    }
    const blacklistedToken = await TokenBlacklist.findOne({ refreshToken});
    if (blacklistedToken) 
        return res.status(403).json({ message: 'Token Blaclisted. Please log in again.' });
    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        if(decoded.token_type !== 'refresh')
            return res.status(400).json({ message: 'Invalid refresh token.' });
        const access = jwt.sign({ user: decoded.email, role: decoded.role }, JWT_SECRET, { expiresIn: '1h' });
        res.header('Authorization', access).send({ "message" : "Token refreshed", access });
    } 
    catch (error) 
    {
        return res.status(400).send('Invalid refresh token.');
    }
}

async function logout(req, res) {
    try {
        const refreshToken = req.body['refresh']; 
        if (!refreshToken) 
            return res.status(401).json({ message: 'No refresh token provided.' });
        const blacklistedToken = await TokenBlacklist.findOne({ refreshToken });
        if (blacklistedToken) 
                return res.status(403).json({ message: 'Refresh Token Blaclisted. Please log in again.' });
        await TokenBlacklist.create({ token: req.headers['authorization'].split(' ')[1] }); 
        await TokenBlacklist.create({ token: refreshToken });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { register, login, refreshToken, logout };

const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function Authenticate(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) 
            return res.status(401).json({ message: 'No Authentication Token Provided.' });
        const blacklistedToken = await TokenBlacklist.findOne({ token });
        if (blacklistedToken) 
            return res.status(403).json({ message: 'Token Blaclisted. Please log in again.' });
        jwt.verify(token, JWT_SECRET, (err, user) => 
        {
        if (err) 
            return res.status(403).json({ message: 'Access Token Invalid. Log in Again' });
        if (user.token_type !== 'access') 
            return res.status(403).json({ message: 'Invalid Access Token ' });
        req.user = user;
        next();
    });
    }
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
}

function isAdmin(req, res, next) {
    const { role } = req.user;
    if (role !== 'admin') 
    {
        return res.status(403).json({ message: 'Unauthorized. Only admins are allowed to access this resource.' });
    }
    next();
}

module.exports = {Authenticate, isAdmin};

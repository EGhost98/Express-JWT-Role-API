const User = require('../models/User');

async function userProfile(req, res) 
{
    const user_email = req.user.email;
    try {
        const users = await User.find({email : user_email}, { password: 0 , __v : 0});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data' });
    }
}

module.exports = { userProfile };

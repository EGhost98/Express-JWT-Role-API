const User = require('../models/user');

async function userProfile(req, res) 
{
    const user_email = req.user.email;
    try {
        const users = await User.findOne({email : user_email}, { password: 0 , __v : 0});
        res.json({"message" : "User Profile", user : users});
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data' });
    }
}

async function updateUser(req, res) 
{
    const user_email = req.user.email;
    try {
        const user = await User.findOne({email : user_email});
        if (!user) 
            return res.status(404).json({ message: 'User not found' });
        username = req.body.name;
        if(!username)
            return res.status(400).json({ message: 'Name is required' });
        if (req.body.name)
            user.name = username;
        await user.save();
        res.json({ message: 'User updated successfully' });
    }
    catch (error) 
    {
        res.status(500).json({ message: 'Error updating user' });
    }
}


module.exports = { userProfile, updateUser };

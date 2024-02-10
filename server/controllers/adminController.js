const User = require('../models/User');

async function getAllUsers(req, res) 
{
    try {
        const users = await User.find();
        res.json(users);
    } 
    catch (error) 
    {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteUser(req, res) 
{
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await User.deleteOne({ _id: id });
        res.json({ message: 'User deleted successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getAllUsers, deleteUser };

const database = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Connect to MongoDB
database.connect().then(() => {
        console.log('Connected to MongoDB');
        async function createAdminUser(email, password) {
            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    console.log('Admin user already exists');
                    return;
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const adminUser = new User({
                    email,
                    password: hashedPassword,
                    role: 'admin'
                });
                await adminUser.save();
                console.log('Admin user created successfully');
            } catch (error) {
                console.error('Error creating admin user:', error);
            } finally {
                database.disconnect();
            }
        }
        const [, , email, password] = process.argv;
        createAdminUser(email, password);
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

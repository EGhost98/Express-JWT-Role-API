const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://admin:0ac26Mh31dM72Rov@cluster0.fp5tf8q.mongodb.net/');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
}

module.exports = { connect , disconnect};

const express = require('express');
const routes = require('./routes');
const app = express();
const cookieParser = require('cookie-parser');
const database = require('./config/database'); 

app.use(express.json());
app.use(cookieParser());

database.connect();

app.use('/api', routes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;

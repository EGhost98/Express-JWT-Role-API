const express = require('express');
const routes = require('./routes');
const app = express();
const cookieParser = require('cookie-parser');
const database = require('./config/database'); 
const helmet = require('helmet');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true });
const cors = require('cors');
const loggingMiddleware = require('./middlewares/loggingMiddleware');
const dotenv = require('dotenv');

dotenv.config();
database.connect();

app.use(loggingMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
// app.use(csrfProtection);
app.use(cors());

app.use('/api', routes);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;

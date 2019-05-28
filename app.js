const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const login = require('./routes/login');
const register = require('./routes/register');
const update = require('./routes/update');
const data = require('./routes/data');

const bodyParser = require('body-parser');

const app = express();
const port = 8333;


app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}


app.use('/login', login);
app.use('/register', register);
app.use('/update', update);
app.use('/data', data);

// Start up server
const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));

//export server
module.exports = server;

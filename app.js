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


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://project.edwardnilsson.se');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();

});


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

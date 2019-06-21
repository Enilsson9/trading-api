const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const stock = require("./stock.js");

const login = require('./routes/login');
const register = require('./routes/register');
const update = require('./routes/update');
const data = require('./routes/data');

const bodyParser = require('body-parser');

const app = express();
const port = 8333;




/*var whitelist = ['https://project.edwardnilsson.se', 'https://socket.edwardnilsson.se']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}*/


//app.use(cors(corsOptions));
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

const io = require('socket.io')(server);

io.origins('*:*')


var princessTarta = {
    name: "gasoline",
    rate: 1.002,
    variance: 0.6,
    startingPoint: 20,
};

var cakes = [princessTarta];

/*app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});*/

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

setInterval(function () {
    cakes.map((cake) => {
        cake["startingPoint"] = stock.getStockPrice(cake);
        return cake;
    });

    // console.log(cakes);

    io.emit("stocks", cakes);
}, 1000);

//export server
module.exports = server;

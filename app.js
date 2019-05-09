const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const login = require('./routes/login');
const register = require('./routes/register');
const update = require('./routes/update');

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


// Start up server
const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));

const mongo = require('mongodb').MongoClient;
// Start up socket.io
const io = require('socket.io')(server);
// Connect to mongo
//mongo.connect('mongodb://localhost:27017/chat', function(err, db){
/*mongo.connect('mongodb://127.0.0.1/chat', function(err, db){
  if(err){
      throw err;
  }

  console.log('MongoDB connected...');

  io.on('connection', function(socket) {
      //console.log(socket.id)
      let chat = db.collection('chats');
      //console.log(chat);

      // Get chats from mongo collection
      chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
        if(err){
            throw err;
        }
        // Emit the messages
        socket.emit('MESSAGES', res);
      });

      socket.on('SEND_MESSAGE', function(data) {
        let user = data.user;
        let message = data.message;

        console.log(data);

        chat.insert({user: user, message: message}, function(){
            io.emit('MESSAGES', data)
        });
      });
  });
});*/




//export server
module.exports = server;

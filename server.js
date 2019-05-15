require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const path = require('path');
const parseurl = require('parseurl');
const mongoose = require('mongoose');
const Character = require('./src/models/character');
const Command = require('./src/models/command');
const url = process.env.MONGO_DB_TEST;
const user = encodeURIComponent(process.env.MONGO_USER);
const pass = encodeURIComponent(process.env.MONGO_PASS);
const port = process.env.PORT;
const tmi = require('tmi.js');

//===Twitchbot===//
 function twitchbot (){
 

    // Valid commands start with:
    let commandPrefix = '!'
    // Define configuration options:
    let opts = {
      identity: {
        username: 'dungeonjambot',
        password: 'oauth:' + process.env.REACT_APP_TWITCH_KEY
      },
      channels: [
        'dungeonjam'
      ]
    }

    // These are the commands the bot knows (defined below):
    let knownCommands = { echo, north, south, east, west}

    // Function called when the "echo" command is issued:
    function echo (target, context, params) {
      // If there's something to echo:
      if (params.length) {
        // Join the params into a string:
        const msg = params.join(' ')
        // Send it back to the correct place:
        sendMessage(target, context, msg)
      } else { // Nothing to echo
        console.log(`* Nothing to echo`)
      }
    }

    // Function called when the "north" command is issued:
    function north (target, context) {
      //console.log(context);
      var userName = context.username;

      //post command
     Command.create({
      Command: 'North',
      User:userName,
      Read: false,
      })   
    }

    // Function called when the "south" command is issued:
    function south (target, context) {
      //console.log(context);
      var userName = context.username;

      //post command
     Command.create({
      Command: 'South',
      User:userName,
      Read: false,
      })    
    }

    // Function called when the "east" command is issued:
    function east (target, context) {
      //console.log(context);
      var userName = context.username;

      //post command
     Command.create({
      Command: 'East',
      User:userName,
      Read: false,
      })      
    }

    // Function called when the "west" command is issued:
    function west (target, context) {
      //console.log(context);
      var userName = context.username;

      //post command
     Command.create({
      Command: 'West',
      User:userName,
      Read: false,
      })   
    }

    // Helper function to send the correct type of message:
    function sendMessage (target, context, message) {
      if (context['message-type'] === 'whisper') {
        client.whisper(target, message)
      } else {
        client.say(target, message)
      }
    }

    // Create a client with our options:
    let client = new tmi.client(opts)

    // Register our event handlers (defined below):
    client.on('message', onMessageHandler)
    client.on('connected', onConnectedHandler)
    client.on('disconnected', onDisconnectedHandler)

    // Connect to Twitch:
    client.connect()

    // Called every time a message comes in:
    function onMessageHandler (target, context, msg, self) {
      if (self) { return } // Ignore messages from the bot

      // This isn't a command since it has no prefix:
      if (msg.substr(0, 1) !== commandPrefix) {
        console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
        return
      }

      // Split the message into individual words:
      const parse = msg.slice(1).split(' ')
      // The command name is the first (0th) one:
      const commandName = parse[0]
      // The rest (if any) are the parameters:
      const params = parse.splice(1)

      // If the command is known, let's execute it:
      if (commandName in knownCommands) {
        // Retrieve the function by its name:
        const command = knownCommands[commandName]
        // Then call the command with parameters:
        command(target, context, params)
        console.log(`* Executed ${commandName} command for ${context.username}`)
      } else {
        console.log(`* Unknown command ${commandName} from ${context.username}`)
      }
    }


    // Called every time the bot connects to Twitch chat:
    function onConnectedHandler (addr, port) {
      console.log(`* Connected to ${addr}:${port}`)
    }

    // Called every time the bot disconnects from Twitch:
    function onDisconnectedHandler (reason) {
      console.log(`disconnected: ${reason}`)
      //process.exit(1)
    }

  };//End of Twitch Bot


//===Test and Application Routing===//

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.js'));
});



//====MONGOOSE CONNECT===//
mongoose.connect('mongodb+srv://'+user+':'+pass+'@'+url, { useNewUrlParser: true }, function (err, db) {
 if (err) {
   console.log('Unable to connect to the mongoDB server. Error:', err);
 } else {
   console.log('Connection established to', 'dungeonjam');
 }
});

//========Establish Connection==========//
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('System Online');
  twitchbot();

});

//===GET Command Queue===//
app.get('/api/commands', function(req,res){
  Command.find({'Read':false}).then(eachOne => {
    res.json(eachOne);
  })
})

//===Update Command Queue===//
app.put('/api/command/:ids', function(req, res){

  var arr = req.params.ids.split(',');
    try{
    Command.updateMany({_id: {$in:arr}}, {$set: {"Read":true}}).then(response=>{
      res.json(response);
    })
    }
    catch (err)
    {
      res.json(err);
    }
    
});


//====GET ALL Characters===//
app.get('/api/characters', function(req, res) {
  Character.find({}).then(eachOne => {
    res.json(eachOne);
    })
  })

//===Get Current Character ===/
app.get('/api/character', function(req, res) {
  Character.findOne({alive: true}, function(err,character){
    if(err){
            res.send(err);
        }
        res.json(character);
  });
});

//====GET Specific Character===//
app.get('/api/thischaracter', function(req, res, next){
  Character.findOne({_id: req.query.id}, function(err, character){
        if(err){
            res.send(err);
        }
        res.json(character);
    });
});

//====POST NEW Character===//
app.post('/api/character', function(req, res) {
  Character.create({
    name: 'Test' /*req.body.SignatureOfGuest*/,
    mapCoord: {x: 0, y: 0},
  }).then(character => {
    res.json(character)
  });
});

//====UPDATE Character===//
app.put('/api/character/:id', function(req, res, next){
    var updchar = {
    name: 'Test' /*req.body.SignatureOfGuest*/,
    mapCoord: {x: 0, y: 0},
  	};

    Character.update({_id:req.params.id},updchar, {}, function(err, character){
      if(err){
             res.send(err);
             }
            res.json(character);
            });
    
});

app.listen(3001 || 8080);
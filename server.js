require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const path = require('path');
const parseurl = require('parseurl');
const mongoose = require('mongoose');
const Character = require('./src/models/character');
const url = process.env.MONGO_DB;
const user = encodeURIComponent(process.env.MONGO_USER);
const pass = encodeURIComponent(process.env.MONGO_PASS);


app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.js'));
});


//====MONGOOSE CONNECT===//
mongoose.connect('mongodb://'+user+':'+pass+'@'+url, function (err, db) {
 if (err) {
   console.log('Unable to connect to the mongoDB server. Error:', err);
 } else {
   console.log('Connection established to', 'dungeonjam');
 }
});
//==========================//
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});



//====GET ALL Characters===//
app.get('/api/characters', function(req, res) {
  Character.find({}).then(eachOne => {
    res.json(eachOne);
    })
  })

// Get Single Character
app.get('/api/character', function(req, res, next){
  Character.findOne({_id: req.query.id}, function(err, character){
        if(err){
        	res.send("test");
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


// Update character
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

app.listen(process.env.PORT || 8080);
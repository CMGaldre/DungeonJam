const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const commandSchema = new Schema({
  Command: String,
  User: String,
  Read: Boolean,
})
module.exports =  mongoose.model('Command', commandSchema, 'Commands')
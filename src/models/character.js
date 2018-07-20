const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const characterSchema = new Schema({
  name: String,
  mapCoord: {
    x: Number,
    y: Number
  },
})
module.exports =  mongoose.model('Character', characterSchema)
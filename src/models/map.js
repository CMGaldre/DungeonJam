const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const tileSchema = new Schema({
  type: String,
  mapCoord: {
    x: Number,
    y: Number
  },
  level: Number,
})
module.exports =  mongoose.model('Tile', tileSchema)

const mapSchema = new Schema({
	name: String,
	tiles: Array,
})
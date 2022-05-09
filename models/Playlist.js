var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Playlist = new Schema({
  Name:{
    type: String,
    require: true,
    min:3,
    max:20
},
  Description:{
    type: String,
    require: true,
    min:3,
    max:50
},

  Type: {
    type: String,
    require: true,
    min:3,
    max:20
},
Photo: {
    type: String,
    require: true,
    min:3,
    max:20
}
  
  
});
const model = mongoose.model("Playlist", Playlist);
module.exports = model;
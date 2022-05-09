var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Reclamation = new Schema({
  Name:{
    type:String,
    
},
Description:{
    type: String,
    require: true,
    min:3,
    max:50
},
UserId:{
    type:String,
},
RoomId:{
    type:String,
},
Status:{
    type:Boolean,
    default:false,
}

});
const model = mongoose.model("Reclamation", Reclamation);
module.exports = model;

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Room = new Schema({
  UserId:{
    type:String,
    
},
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
  StartDate: Date,
  EndDate: Date,
  Type: {
    type: String,
    require: true,
    min:3,
    max:20
},
  Status: String,
  
  Participants:{
    type:Array,
    default:[]
}, 
isCreator:{
    type:Boolean,
    default:false,
}
  
  
});
const model = mongoose.model("Room", Room);
module.exports = model;
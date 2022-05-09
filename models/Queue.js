var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Queue = new Schema({
  Participant:{ 
    type: Schema.Types.ObjectId,
     ref: "User" },
UrlSong:{
    type: String,
    
    min:3,
    max:100
},
RoomId:{
  type:String,
}
});
const model = mongoose.model("Queue", Queue);
module.exports = model;
